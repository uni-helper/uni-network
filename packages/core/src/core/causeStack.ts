/**
 * 被包装错误的堆栈拼装，只在库内使用，不从 core/index 导出。
 *
 * 和 UnError 放在一起会通过 `export *` 变成公开 API，这两个符号是内部实现。
 */

/** 拼接在 stack 里的分隔符，Un.request 靠它把调用点堆栈插到被包装错误前面 */
export const CAUSED_BY_SEPARATOR = "\nCaused by: ";

// 记住自己追加的那一段，重复包装时只认这一段，避免把错误消息或用户改写的 stack 当成 cause
const $causeStack = Symbol("causeStack");

/** 返回追加的 cause 段在 stack 里的起点，没追加过返回 -1 */
export const getCauseStackIndex = (error: Error, stack: string) => {
  const causeStack = (error as any)[$causeStack];
  return typeof causeStack === "string" && stack.endsWith(causeStack)
    ? stack.length - causeStack.length
    : -1;
};

/**
 * 把被包装错误的 stack 拼到 target.stack 末尾。
 *
 * cause 属性已经能拿到原始错误，但不少错误上报只读 stack，拼进去才不会
 * 只看到本库这一层。读 stack 全程做类型判断，自定义 Error.prepareStackTrace
 * 或不可写的 stack 都不能让错误构造抛出。
 */
export const appendCauseStack = (target: Error, source?: Error) => {
  try {
    const sourceStack = source?.stack;
    const targetStack = target.stack;

    if (typeof sourceStack !== "string" || !sourceStack) {
      return;
    }
    if (typeof targetStack !== "string" || !targetStack) {
      return;
    }

    const causeStack = CAUSED_BY_SEPARATOR + sourceStack;
    target.stack = targetStack + causeStack;
    Object.defineProperty(target, $causeStack, { value: causeStack });
  } catch (_) {
    // 忽略自定义 stack hook 或 stack 不可写导致的失败
  }
};
