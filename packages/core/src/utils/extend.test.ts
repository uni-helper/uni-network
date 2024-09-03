import { describe, expect, it } from "vitest";
import { extend } from "./extend";

describe("utils::extend", () => {
  it("should be mutable", () => {
    const a: Record<string, any> = {};
    const b: Record<string, any> = { foo: 123 };

    extend(a, b);

    expect(a.foo).toEqual(b.foo);
  });

  it("should extend properties", () => {
    let a: Record<string, any> = { foo: 123, bar: 456 };
    const b: Record<string, any> = { bar: 789 };

    a = extend(a, b);

    expect(a.foo).toEqual(123);
    expect(a.bar).toEqual(789);
  });

  it("should bind to thisArg", () => {
    const a: Record<string, any> = {};
    const b: Record<string, any> = {
      getFoo: function getFoo() {
        return this.foo;
      },
    };
    const thisArg = { foo: "barbaz" };

    extend(a, b, thisArg);

    expect(typeof a.getFoo).toEqual("function");
    expect(a.getFoo()).toEqual(thisArg.foo);
  });
});
