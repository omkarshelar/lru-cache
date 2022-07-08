// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ⬆️ Helps in debugging and calling private methods for testing and debugging

import { expect, it, test } from 'vitest';

import { Cache } from '../src/index';

const initCache = () => {
  const cache = new Cache<string>(3);
  cache.set('hello1', 'world1');
  cache.set('hello2', 'world2');
  cache.set('hello3', 'world3');
  return cache;
};

it('set cache', () => {
  const cache = new Cache<string>();
  cache.set('hello', 'world');
  expect(cache.newestEntry).toBe('hello');
  expect(cache.oldestEntry).toBe('hello');
  cache.set('hello1', 'world1');
  expect(cache.oldestEntry).toBe('hello');
  expect(cache.newestEntry).toBe('hello1');
});

it('simple evict', () => {
  const cache = new Cache<string>(3);
  cache.set('hello1', 'world1');
  cache.set('hello2', 'world2');
  cache.set('hello3', 'world3');
  cache.set('hello4', 'world4');
  expect(cache.get('hello1')).toBe(undefined);
});

it('LRU 1', () => {
  const c = initCache();
  c.get('hello1');
  c.set('hello4', 'world4');
  expect(c.getSize()).toBe(3);
  expect(c.get('hello1')).toBe('world1');
  expect(c.get('hello2')).toBe(undefined);
});

it('LRU 2', () => {
  const c = initCache();
  c.get('hello1');
  c.get('hello3');
  c.set('hello4', 'world4');
  expect(c.get('hello2')).toBe(undefined);
  expect(c.getSize()).toBe(3);
  expect(c.newestEntry).toBe('hello4');
  expect(c.oldestEntry).toBe('hello1');
});

it('LRU 3', () => {
  const c = initCache();
  c.get('hello2');
  c.set('hello4', 'world4');
  expect(c.getSize()).toBe(3);
  expect(c.get('hello1')).toBe(undefined);
  expect(c.getSize()).toBe(3);
  expect(c.get('hello1')).toBe(undefined);
  expect(c.oldestEntry).toBe('hello3');
  expect(c.newestEntry).toBe('hello4');
  c.set('hello5', 'world5');
  expect(c.newestEntry).toBe('hello5');
  expect(c.oldestEntry).toBe('hello2');
  expect(c.getSize()).toBe(3);
  c.set('hello6', 'world6');
  expect(c.get('hello2')).toBe(undefined);
  expect(c.getSize()).toBe(3);
});

it('Invalidate', () => {
  let c = initCache();
  c.invalidateKey('hello2');
  expect(c.get('hello2')).toBe(undefined);
  expect(c.oldestEntry).toBe('hello1');
  expect(c.newestEntry).toBe('hello3');
  c = initCache();
  c.invalidateKey('hello1');
  expect(c.get('hello1')).toBe(undefined);
  expect(c.oldestEntry).toBe('hello2');
  expect(c.newestEntry).toBe('hello3');
  c = initCache();
  c.invalidateKey('hello3');
  expect(c.get('hello3')).toBe(undefined);
  expect(c.oldestEntry).toBe('hello1');
  expect(c.newestEntry).toBe('hello2');
  c = initCache();
  c.invalidateCache();
  expect(c.get('hello1')).toBe(undefined);
  expect(c.get('hello2')).toBe(undefined);
  expect(c.get('hello3')).toBe(undefined);
  expect(c.invalidateKey('something')).toBe(undefined);
});

it('Invalidate single entry', () => {
  const c = new Cache<string>();
  c.set('hello1', 'world1');
  expect(c.invalidateKey('hello1')).toBe(undefined);
});

test('Cache Init Fail', () => {
  const t = () => {
    new Cache<string>(0);
  };
  expect(t).toThrow('Invalid cache size');
});

test('Get Size', () => {
  const c = initCache();
  expect(c.getAll()).toMatchObject({
    hello1: { value: 'world1', previousEntry: null, nextEntry: 'hello2' },
    hello2: { value: 'world2', previousEntry: 'hello1', nextEntry: 'hello3' },
    hello3: { value: 'world3', previousEntry: 'hello2', nextEntry: null },
  });
});

test('LRU 4', () => {
  const c = new Cache<string>(5);
  c.set('hello1', 'world1');
  c.set('hello2', 'world2');
  c.set('hello3', 'world3');
  expect(c.getSize()).toBe(3);
  expect(c.get('hello1')).toBe('world1');
  expect(c.oldestEntry).toBe('hello2');
  expect(c.newestEntry).toBe('hello1');
  c.set('hello4', 'world4');
  c.set('hello5', 'world5');
  expect(c.newestEntry).toBe('hello5');
  expect(c.getSize()).toBe(5);
  expect(c.get('hello2')).toBe('world2');
  c.set('hello6', 'world6');
  expect(c.get('hello3')).toBe(undefined);
});
