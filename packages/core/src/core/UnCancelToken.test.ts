import { describe, expect, it } from "vitest";
import { UnCancelToken, type UnCanceler } from "./UnCancelToken";
import { UnCanceledError } from "./UnCanceledError";

function noop() {}

describe("core:UnCancelToken", () => {
  describe("constructor", () => {
    it("throws when executor is not specified", () => {
      expect(() => {
        // @ts-expect-error Expected 1 arguments, but got 0.ts(2554)
        new UnCancelToken();
      }).toThrowError(new TypeError("executor must be a function."));
    });

    it("throws when executor is not a function", () => {
      expect(() => {
        // @ts-expect-error argument of type 'number' is not assignable to parameter of type '(cancel: UnCanceler<UnData, UnData>) => void'.ts(2345)
        new UnCancelToken(123);
      }).toThrowError(new TypeError("executor must be a function."));
    });
  });

  describe("reason", () => {
    it("returns a UnCanceledError if cancellation has been requested", () => {
      let cancel: UnCanceler;
      const token = new UnCancelToken((c) => {
        cancel = c;
      });
      // @ts-expect-error Variable 'cancel' is used before being assigned.ts(2454)
      cancel("Operation has been canceled.");
      expect(token.reason).toEqual(expect.any(UnCanceledError));
      expect(token.reason?.message).toBe("Operation has been canceled.");
      expect(token.reason?.isUnCanceledError).toBe(true);
    });

    it("returns undefined if cancellation has not been requested", () => {
      const token = new UnCancelToken(noop);
      expect(token.reason).toBeUndefined();
    });
  });

  describe("promise", () => {
    it("returns a Promise that resolves when cancellation is requested", () =>
      new Promise<void>((done) => {
        let cancel: UnCanceler;
        const token = new UnCancelToken((c) => {
          cancel = c;
        });
        token.promise.then((value) => {
          expect(value).toEqual(expect.any(UnCanceledError));
          expect(value.message).toBe("Operation has been canceled.");
          done();
        });
        // @ts-expect-error Variable 'cancel' is used before being assigned.ts(2454)
        cancel("Operation has been canceled.");
      }));
  });

  describe("throwIfRequested", () => {
    it("throws if cancellation has been requested", () => {
      // Note: we cannot use expect.toThrowError here as UnCanceledError does not inherit from Error
      let cancel: UnCanceler;
      const token = new UnCancelToken((c) => {
        cancel = c;
      });
      // @ts-expect-error Variable 'cancel' is used before being assigned.ts(2454)
      cancel("Operation has been canceled.");
      try {
        token.throwIfRequested();
      } catch (error) {
        expect(error).toBeInstanceOf(UnCanceledError);
        expect((error as UnCanceledError).message).toBe(
          "Operation has been canceled.",
        );
      }
    });

    it("does not throw if cancellation has not been requested", () => {
      const token = new UnCancelToken(noop);
      token.throwIfRequested();
    });
  });

  describe("source", () => {
    it("returns an object containing token and cancel function", () => {
      const source = UnCancelToken.source();
      expect(source.token).toEqual(expect.any(UnCancelToken));
      expect(source.cancel).toEqual(expect.any(Function));
      expect(source.token.reason).toBeUndefined();
      source.cancel("Operation has been canceled.");
      expect(source.token.reason).toEqual(expect.any(UnCanceledError));
      expect(source.token.reason?.message).toBe("Operation has been canceled.");
    });
  });
});
