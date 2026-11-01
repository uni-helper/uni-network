import { afterEach, describe, expect, it, vi } from "vitest";
import { dispatchRequest } from "./dispatchRequest";
import { UnCanceledError } from "./UnCanceledError";
import { UnError } from "./UnError";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("core::dispatchRequest", () => {
  it("should record how long the adapter took", async () => {
    // 第一次取起始时间，第二次取结束时间
    vi.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(1013);

    const response = await dispatchRequest({
      url: "/foo",
      adapter: async (config: any) => ({ config, status: 200, data: "ok" }),
    } as any);

    expect(response.duration).toBe(13);
  });

  it("should record duration on the response attached to an error", async () => {
    vi.spyOn(Date, "now").mockReturnValueOnce(2000).mockReturnValueOnce(2007);

    const response = { status: 500, data: "bad" };
    const error = await dispatchRequest({
      url: "/foo",
      adapter: async () => {
        throw new UnError(
          "boom",
          UnError.ERR_BAD_RESPONSE,
          undefined,
          undefined,
          response as any,
        );
      },
    } as any).catch((reason) => reason);

    expect(error.response.duration).toBe(7);
  });

  it("should not call the adapter when the signal is already aborted", () => {
    const adapter = vi.fn(async () => ({ status: 200, data: "ok" }));

    expect(() =>
      dispatchRequest({
        url: "/foo",
        signal: { aborted: true },
        adapter,
      } as any),
    ).toThrow(UnCanceledError);
    expect(adapter).not.toHaveBeenCalled();
  });
});
