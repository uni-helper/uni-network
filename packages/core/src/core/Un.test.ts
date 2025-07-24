import { describe, expect, it } from "vitest";
import { Un } from "./Un";

describe("Axios", () => {
  it("should not throw if the config argument is omitted", () => {
    const un = new Un();

    expect(un.defaults).toStrictEqual({});
  });
});
