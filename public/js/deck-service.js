// DeckService - provides index & deck fetching and basic search/filter utilities
// runtime validation error for deck JSON (exposed on window for non-module usage)
class DeckValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DeckValidationError';
    }
}
window.DeckValidationError = DeckValidationError;
class DeckService {
    constructor() {
    // Use relative paths so the site works when opened locally or served from a subpath
    this.indexUrl = './data/decks.json';
    this.deckBase = './data/decks/';
        this.indexCache = null;
        this.deckCache = new Map();
        this.pendingIndex = null;
        this.pendingDecks = new Map();
        this.defaultTimeout = 8000;
    }
    async fetchJson(url, timeout = this.defaultTimeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            if (!res.ok) {
                if (res.status === 404)
                    throw new Error('Not found');
                throw new Error(`Network error: ${res.status}`);
            }
            return (await res.json());
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.name) === 'AbortError')
                throw new Error('Request timed out');
            throw err;
        }
    }
    async fetchIndex(force = false) {
        if (this.indexCache && !force)
            return this.indexCache;
        if (this.pendingIndex && !force)
            return this.pendingIndex;
        this.pendingIndex = this.fetchJson(this.indexUrl)
            .then((arr) => {
            if (!Array.isArray(arr))
                throw new Error('Index invalid');
            this.indexCache = arr;
            this.pendingIndex = null;
            return arr;
        })
            .catch((err) => {
            this.pendingIndex = null;
            throw err;
        });
        return this.pendingIndex;
    }
    async fetchDeck(id, force = false) {
        if (!id)
            throw new Error('Invalid deck id');
        if (this.deckCache.has(id) && !force)
            return this.deckCache.get(id);
        if (this.pendingDecks.has(id) && !force)
            return this.pendingDecks.get(id);
        const url = `${this.deckBase}${encodeURIComponent(id)}.json`;
        const p = this.fetchJson(url)
            .then((data) => {
            if (!data || typeof data !== 'object')
                throw new Error('Deck JSON invalid');
            // runtime validation: ensure required fields exist and are of correct types
            if (typeof data.name !== 'string' || !Array.isArray(data.cards)) {
                throw new DeckValidationError('Deck JSON missing required fields (name, cards)');
            }
            this.deckCache.set(id, data);
            this.pendingDecks.delete(id);
            return data;
        })
            .catch((err) => {
            this.pendingDecks.delete(id);
            throw err;
        });
        this.pendingDecks.set(id, p);
        return p;
    }
    async searchIndex(q) {
        const idx = await this.fetchIndex();
        const term = (q || '').trim().toLowerCase();
        if (!term)
            return idx;
        return idx.filter((d) => d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term));
    }
    // utilities
    getCachedDeck(id) {
        return this.deckCache.get(id);
    }
    clearCache() {
        this.deckCache.clear();
        this.indexCache = null;
    }
}
// expose a global instance for the other scripts to use (no module system here)
const deckService = new DeckService();
;
window.deckService = deckService;
//# sourceMappingURL=deck-service.js.map