import { describe, expect, it } from "vitest";
import { CAUSED_BY_SEPARATOR } from "./causeStack";
import { Un } from "./Un";
import { UnError } from "./UnError";

describe("Axios", () => {
  it("should not throw if the config argument is omitted", () => {
    const un = new Un();

    expect(un.defaults).toStrictEqual({});
  });
});

describe("synchronous request interceptor failure", () => {
  const makeAdapter = (dispatched: unknown[]) => async (config: any) => {
    dispatched.push(config);
    return { config, status: 200, data: "ok" } as any;
  };

  const syncOptions = { synchronous: true } as const;

  it("should not dispatch when fulfilled throws and rejected is absent", async () => {
    const dispatched: unknown[] = [];
    const un = new Un();
    un.interceptors.request.use(
      () => {
        throw new Error("interceptor error");
      },
      undefined,
      syncOptions,
    );

    await expect(
      un.request({
        url: "https://example.com",
        adapter: makeAdapter(dispatched),
      } as any),
    ).rejects.toThrow("interceptor error");
    expect(dispatched).toHaveLength(0);
  });

  it("should not dispatch when paired rejected handler also throws", async () => {
    const dispatched: unknown[] = [];
    const un = new Un();
    un.interceptors.request.use(
      () => {
        throw new Error("interceptor error");
      },
      () => {
        throw new Error("rejection error");
      },
      syncOptions,
    );

    await expect(
      un.request({
        url: "https://example.com",
        adapter: makeAdapter(dispatched),
      } as any),
    ).rejects.toThrow("rejection error");
    expect(dispatched).toHaveLength(0);
  });

  it("should dispatch when paired rejected handler recovers", async () => {
    const dispatched: unknown[] = [];
    const un = new Un();
    un.interceptors.request.use(
      () => {
        throw new Error("interceptor error");
      },
      () =>
        ({
          url: "https://example.com",
          adapter: makeAdapter(dispatched),
        }) as any,
      syncOptions,
    );

    const response = await un.request({
      url: "https://example.com",
      adapter: makeAdapter(dispatched),
    } as any);
    expect(dispatched).toHaveLength(1);
    expect(response.data).toBe("ok");
  });
});

describe("request error stack decoration", () => {
  it("should not throw when error.stack is not a string", async () => {
    // https://github.com/axios/axios/pull/11109
    const un = new Un();
    un.interceptors.request.use(() => {
      const error = new Error("boom");
      Object.defineProperty(error, "stack", { value: 123, writable: true });
      throw error;
    });

    await expect(un.request("/")).rejects.toThrow("boom");
  });

  it("should put caller frames ahead of the inlined cause stack", async () => {
    // https://github.com/axios/axios/pull/11142
    const un = new Un();
    const inner = new Error("inner cause");
    const causeSection = CAUSED_BY_SEPARATOR + inner.stack;

    const error = await un
      .request({
        url: "https://example.com",
        adapter: async () => {
          throw UnError.from(inner);
        },
      } as any)
      .catch((reason) => reason);

    expect(error.stack.endsWith(causeSection)).toBe(true);
    expect(error.stack.split(CAUSED_BY_SEPARATOR)).toHaveLength(2);
  });
});
