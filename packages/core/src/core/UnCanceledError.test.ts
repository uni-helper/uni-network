import { describe, expect, it } from "vitest";
import { UnCanceledError } from "./UnCanceledError";

describe("core:UnCanceledError", () => {
  describe("toString", () => {
    it("returns correct result when message is not specified", () => {
      const cancel = new UnCanceledError();
      expect(cancel.toString()).toBe("CanceledError: canceled");
    });

    it("returns correct result when message is specified", () => {
      const cancel = new UnCanceledError("Operation has been canceled.");
      expect(cancel.toString()).toBe(
        "CanceledError: Operation has been canceled.",
      );
    });
  });

  it("should be a native error as checked by the NodeJS `isNativeError` function", () => {
    if (typeof process !== "undefined" && process.release.name === "node") {
      const { isNativeError } = require("node:util/types");
      expect(
        isNativeError(new UnCanceledError("My Canceled Error")),
      ).toBeTruthy();
    }
  });
});
