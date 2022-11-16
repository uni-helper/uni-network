import { describe, it, expect } from 'vitest';
import { combineUrls } from './combineUrls';

describe('utils::combineUrls', () => {
  it('should combine URLs', () => {
    expect(combineUrls('https://api.github.com', '/users')).toBe('https://api.github.com/users');
  });

  it('should remove duplicate slashes', () => {
    expect(combineUrls('https://api.github.com/', '/users')).toBe('https://api.github.com/users');
  });

  it('should insert missing slash', () => {
    expect(combineUrls('https://api.github.com', 'users')).toBe('https://api.github.com/users');
  });

  it('should not insert slash when relative url missing/empty', () => {
    expect(combineUrls('https://api.github.com/users', '')).toBe('https://api.github.com/users');
  });

  it('should allow a single slash for relative url', () => {
    expect(combineUrls('https://api.github.com/users', '/')).toBe('https://api.github.com/users/');
  });
});
