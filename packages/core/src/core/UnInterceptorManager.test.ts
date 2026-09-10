import { describe, expect, it } from "vitest";
import { UnInterceptorManager } from "./UnInterceptorManager";

describe("core::UnInterceptorManager", () => {
  it("should trim trailing ejected handlers without changing earlier ids", () => {
    const manager = new UnInterceptorManager<string>();
    const first = manager.use((value) => value);
    const second = manager.use((value) => value);
    const third = manager.use((value) => value);

    manager.eject(third);
    manager.eject(second);
    // 尾部空洞被裁剪,数组不再无限增长
    expect((manager as any).handlers).toHaveLength(1);

    // 裁剪后 eject 首个也清空数组
    manager.eject(first);
    expect((manager as any).handlers).toHaveLength(0);
  });

  it("should keep middle holes and not shift ids", () => {
    const manager = new UnInterceptorManager<string>();
    const first = manager.use((value) => value);
    manager.use((value) => value);
    manager.eject(first);

    // 中间空洞保留,后续 id 顺序不变
    expect((manager as any).handlers).toHaveLength(2);
    expect((manager as any).handlers[0]).toBeNull();
  });
});
