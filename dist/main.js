function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Cache", () => $20660adb77b18d0d$export$2e2bcd8739ae039);
class $20660adb77b18d0d$export$2e2bcd8739ae039 {
    constructor(maxSize = 10){
        if (maxSize < 1) throw new Error("Invalid cache size");
        this.cache = {};
        this.newestEntry = null;
        this.oldestEntry = null;
        this.maxSize = maxSize;
    }
    getSize() {
        return Object.keys(this.cache).length;
    }
    get(key) {
        const value = this.cache[key];
        if (!value || this.getSize() === 1 || this.newestEntry === key) return value?.value;
        const tPrev = value?.previousEntry;
        const tNext = value?.nextEntry;
        if (this.oldestEntry === key) this.oldestEntry = tNext;
        if (tPrev) this.cache[tPrev].nextEntry = tNext;
        if (tNext) this.cache[tNext].previousEntry = tPrev;
        value.previousEntry = this.newestEntry;
        if (this.newestEntry) this.cache[this.newestEntry].nextEntry = key;
        value.nextEntry = null;
        this.newestEntry = key;
        return value?.value;
    }
    set(key, value) {
        if (this.getSize() === this.maxSize && !this.cache[key]) this.evict();
        this.cache[key] = {
            value: value,
            previousEntry: this.newestEntry,
            nextEntry: null
        };
        if (this.newestEntry) this.cache[this.newestEntry].nextEntry = key;
        this.newestEntry = key;
        if (this.getSize() === 1) // If this is the first K-V pair being added.
        this.oldestEntry = key;
    }
    invalidateKey(key) {
        const value = this.cache[key];
        if (this.isEmpty() || !value) return;
        else if (this.getSize() === 1 && value) {
            // It's the only entry
            this.invalidateCache();
            return;
        }
        if (key === this.oldestEntry) this.oldestEntry = value.nextEntry;
        if (key === this.newestEntry) this.newestEntry = value.previousEntry;
        // Somewhere in the middle
        const tPrev = value.previousEntry;
        const tNext = value.nextEntry;
        if (tPrev) this.cache[tPrev].nextEntry = value.nextEntry;
        if (tNext) this.cache[tNext].previousEntry = value.previousEntry;
        delete this.cache[key];
    }
    isEmpty() {
        return !this.getSize();
    }
    evict() {
        if (this.getSize() && this.oldestEntry) {
            const tNext = this.cache[this.oldestEntry]?.nextEntry;
            if (tNext) this.cache[tNext].previousEntry = null;
            delete this.cache[this.oldestEntry];
            this.oldestEntry = tNext;
        }
    }
    invalidateCache() {
        this.cache = {};
        this.oldestEntry = null;
        this.newestEntry = null;
    }
    getAll() {
        return this.cache;
    }
}




//# sourceMappingURL=main.js.map
