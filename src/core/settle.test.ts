import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UnResponse } from '../types';
import { settle } from './settle';

describe('core::settle', () => {
  let resolve: (value: UnResponse | PromiseLike<UnResponse>) => void;
  let reject: (reason?: any) => void;

  beforeEach(() => {
    resolve = vi.fn();
    reject = vi.fn();
  });

  it('should resolve promise if status is not set', async () => {
    const response = {
      config: {
        validateStatus: () => true,
      },
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  it('should resolve promise if validateStatus is not set', () => {
    const response = {
      status: 500,
      config: {},
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  it('should resolve promise if validateStatus returns true', () => {
    const response = {
      status: 500,
      config: {
        validateStatus: () => true,
      },
    };
    settle(resolve, reject, response);
    expect(resolve).toHaveBeenCalledWith(response);
    expect(reject).not.toHaveBeenCalled();
  });

  it('should reject promise if validateStatus returns false', () => {
    const task = {
      path: '/foo',
    };
    const response = {
      status: 500,
      config: {
        validateStatus: () => false,
      },
      task,
    };
    settle(resolve, reject, response);
    expect(resolve).not.toHaveBeenCalled();
    expect(reject).toHaveBeenCalled();
    // @ts-expect-error Property 'calls' does not exist on type '(reason?: any) => void'.ts(2339)
    const reason = reject.calls[0][0];
    expect(reason instanceof Error).toBe(true);
    expect(reason.message).toBe('Request failed with status code 500');
    expect(reason.config).toBe(response.config);
    expect(reason.task).toBe(task);
    expect(reason.response).toBe(response);
  });

  it('should pass status to validateStatus', () => {
    const validateStatus = vi.fn();
    const response = {
      status: 500,
      config: {
        validateStatus: validateStatus,
      },
    };
    settle(resolve, reject, response);
    expect(validateStatus).toHaveBeenCalledWith(500);
  });
});
