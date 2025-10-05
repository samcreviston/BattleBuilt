// DeckService - provides index & deck fetching and basic search/filter utilities

interface DeckIndex {
  index: string;
  name: string;
  description: string;
}

interface DeckData {
  name?: string;
  description?: string;
  cards?: string[];
  strategyDescription?: string;
}

// runtime validation error for deck JSON
export class DeckValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DeckValidationError';
  }
}

class DeckService {
  private indexUrl = '/data/decks.json';
  private deckBase = '/data/decks/';
  private indexCache: DeckIndex[] | null = null;
  private deckCache = new Map<string, DeckData>();
  private pendingIndex: Promise<DeckIndex[]> | null = null;
  private pendingDecks = new Map<string, Promise<DeckData>>();
  private defaultTimeout = 8000;

  private async fetchJson<T>(url: string, timeout = this.defaultTimeout): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Not found');
        throw new Error(`Network error: ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      if ((err as any)?.name === 'AbortError') throw new Error('Request timed out');
      throw err;
    }
  }

  async fetchIndex(force = false): Promise<DeckIndex[]> {
    if (this.indexCache && !force) return this.indexCache;
    if (this.pendingIndex && !force) return this.pendingIndex;

    this.pendingIndex = this.fetchJson<DeckIndex[]>(this.indexUrl)
      .then((arr) => {
        if (!Array.isArray(arr)) throw new Error('Index invalid');
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

  async fetchDeck(id: string, force = false): Promise<DeckData> {
    if (!id) throw new Error('Invalid deck id');
    if (this.deckCache.has(id) && !force) return this.deckCache.get(id)!;
    if (this.pendingDecks.has(id) && !force) return this.pendingDecks.get(id)!;

    const url = `${this.deckBase}${encodeURIComponent(id)}.json`;
    const p = this.fetchJson<DeckData>(url)
      .then((data) => {
        if (!data || typeof data !== 'object') throw new Error('Deck JSON invalid');
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

  async searchIndex(q: string): Promise<DeckIndex[]> {
    const idx = await this.fetchIndex();
    const term = (q || '').trim().toLowerCase();
    if (!term) return idx;
    return idx.filter((d) => d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term));
  }

  // utilities
  getCachedDeck(id: string): DeckData | undefined {
    return this.deckCache.get(id);
  }

  clearCache() {
    this.deckCache.clear();
    this.indexCache = null;
  }
}

// expose a global instance for the other scripts to use (no module system here)
const deckService = new DeckService();
;(window as any).deckService = deckService;
