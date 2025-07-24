import { describe, expect, it } from "vitest";
import { isUnCancel } from "./isUnCancel";
import { UnCanceledError } from "./UnCanceledError";

describe("core:isCancel", () => {
  it("returns true if value is a CanceledError", () => {
    expect(isUnCancel(new UnCanceledError())).toBe(true);
  });

  it("returns false if value is not a CanceledError", () => {
    expect(isUnCancel({ foo: "bar" })).toBe(false);
  });
});
