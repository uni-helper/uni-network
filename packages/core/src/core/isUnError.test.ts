import { describe, expect, it } from "vitest";
import { isUnError } from "./isUnError";
import { UnError } from "./UnError";

describe("core::isUnError", () => {
  it("should return true if the error is created by core::createError", () => {
    expect(isUnError(new UnError("Boom!", undefined, { foo: "bar" }))).toBe(
      true,
    );
  });

  it("should return true if the error is enhanced by core::enhanceError", () => {
    expect(
      isUnError(UnError.from(new Error("Boom!"), undefined, { foo: "bar" })),
    ).toBe(true);
  });

  it("should return false if the error is a normal Error instance", () => {
    expect(isUnError(new Error("Boom!"))).toBe(false);
  });

  it("should return false if the error is null", () => {
    expect(isUnError(null)).toBe(false);
  });
});
