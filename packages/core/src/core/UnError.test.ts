import { describe, expect, it } from "vitest";
import { UnError } from "./UnError";

describe("core::UnError", () => {
  it("should create an Error with message, config, code, task, response, stack and isUnError", () => {
    const task = { path: "/foo" };
    const response = { status: 200, data: { foo: "bar" } };
    const error = new UnError(
      "Boom!",
      "ESOMETHING",
      { foo: "bar" },
      task,
      response,
    );
    expect(error instanceof Error).toBe(true);
    expect(error.message).toBe("Boom!");
    expect(error.config).toEqual({ foo: "bar" });
    expect(error.code).toBe("ESOMETHING");
    expect(error.task).toBe(task);
    expect(error.response).toBe(response);
    expect(error.isUnError).toBe(true);
    expect(error.stack).toBeDefined();
  });
  it("should create an Error that can be serialized to JSON", () => {
    // Attempting to serialize task and response results in
    //    TypeError: Converting circular structure to JSON
    const task = { path: "/foo" };
    const response = { status: 200, data: { foo: "bar" } };
    const error = new UnError(
      "Boom!",
      "ESOMETHING",
      { foo: "bar" },
      task,
      response,
    );
    const json = error.toJSON();
    expect(json.message).toBe("Boom!");
    expect(json.config).toEqual({ foo: "bar" });
    expect(json.code).toBe("ESOMETHING");
    expect(json.status).toBe(200);
    expect(json.task).toBe(undefined);
    expect(json.response).toBe(undefined);
  });

  describe("core::createError.from", () => {
    it("should add config, config, task and response to error", () => {
      const error = new Error("Boom!");
      const task = { path: "/foo" };
      const response = { status: 200, data: { foo: "bar" } };

      const urError = UnError.from(
        error,
        "ESOMETHING",
        { foo: "bar" },
        task,
        response,
      );
      expect(urError.config).toEqual({ foo: "bar" });
      expect(urError.code).toBe("ESOMETHING");
      expect(urError.task).toBe(task);
      expect(urError.response).toBe(response);
      expect(urError.isUnError).toBe(true);
    });

    it("should return error", () => {
      const error = new Error("Boom!");
      expect(
        UnError.from(error, "ESOMETHING", { foo: "bar" }) instanceof UnError,
      ).toBeTruthy();
    });
  });

  it("should have status property when response was passed to the constructor", () => {
    const err = new UnError("test", "foo", {}, {}, { status: 400 });
    expect(err.status).toBe(400);
  });
});
