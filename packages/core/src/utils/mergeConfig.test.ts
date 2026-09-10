import { describe, expect, it } from "vitest";
import { mergeConfig } from "./mergeConfig";

describe("utils::mergeConfig", () => {
  it("should preserve own enumerable symbol keys", () => {
    const sym = Symbol("custom");
    const config2 = { [sym]: "kept", url: "/foo" };

    const merged = mergeConfig<any, any>({ url: "/bar" }, config2);

    expect(merged[sym]).toBe("kept");
    expect(merged.url).toBe("/foo");
    // 普通 JSON 序列化不受影响
    expect(JSON.parse(JSON.stringify(merged)).url).toBe("/foo");
  });
});
