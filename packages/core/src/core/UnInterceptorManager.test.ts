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

  it("should not reuse an id after trailing handlers are trimmed", () => {
    // https://github.com/axios/axios/pull/11139
    const manager = new UnInterceptorManager<string>();
    const first = manager.use((value) => value);
    manager.eject(first);

    const second = manager.use((value) => value);
    expect(second).not.toBe(first);

    // 拿旧 id 再 eject 一次,不能误删新拦截器
    manager.eject(first);
    let called = 0;
    manager.each(() => {
      called += 1;
    });
    expect(called).toBe(1);
  });

  it("should eject by a numeric string id from untyped callers", () => {
    const manager = new UnInterceptorManager<string>();
    const id = manager.use((value) => value);

    manager.eject(String(id) as any);

    expect((manager as any).handlers).toHaveLength(0);
  });
});
