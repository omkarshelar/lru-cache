# lru-cache
A simple LRU cache for the backend or frontend, written in TS

## Usage:

```
const cache = new Cache<string>(3); // Note: They key has to be a string, value can be any type
cache.set('hello1', 'world1');
cache.set('hello2', 'world2');
cache.set('hello3', 'world3');
cache.get('hello1')
```

```
const cache = new Cache<string>(3); // cache size = 3
cache.set('hello1', 'world1');
cache.set('hello2', 'world2');
cache.set('hello3', 'world3');
cache.set('hello4', 'world4'); // `hello1`(oldest entry evicted)
cache.get('hello1'); // Will be `undefined` because cache size is three
cache.invalidateKey('hello2');
cache.get('hello2'); // undefined because invalidated
```
