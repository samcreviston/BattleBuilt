declare const deckService: any;

interface DeckData {
  name?: string;
  description?: string;
  cards?: string[];
  strategyDescription?: string;
}

function qs(name: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderDeck(data: DeckData) {
  const titleEl = document.getElementById('deck-title');
  const strategyEl = document.getElementById('strategy-content');
  const cardsEl = document.getElementById('cards-list');

  if (titleEl) titleEl.textContent = data.name || 'Untitled Deck';
  if (strategyEl) strategyEl.innerHTML = `<p>${data.strategyDescription || ''}</p>`;

  if (cardsEl) {
    cardsEl.innerHTML = '';
    if (Array.isArray(data.cards) && data.cards.length) {
      const ul = document.createElement('ul');
      data.cards.forEach((c) => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
      });
      cardsEl.appendChild(ul);
    } else {
      cardsEl.innerHTML = '<p>No cards listed.</p>';
    }
  }
}

function showError(msg: string) {
  const titleEl = document.getElementById('deck-title');
  const strategyEl = document.getElementById('strategy-content');
  const cardsEl = document.getElementById('cards-list');
  if (titleEl) titleEl.textContent = 'Deck not found';
  if (strategyEl) strategyEl.innerHTML = `<p>${msg}</p>`;
  if (cardsEl) cardsEl.innerHTML = '';
}

async function init() {
  const id = qs('i');
  if (!id) {
    showError('No deck id provided in the URL (use ?i=123456)');
    return;
  }

  try {
    const deck = await deckService.fetchDeck(id);
    renderDeck(deck);
  } catch (err) {
    console.error(err);
    // if the deck JSON failed validation, show a friendlier message
    if (err && (err as any).name === 'DeckValidationError') {
      showError('Deck data is invalid or missing fields.');
    } else {
      showError('Unable to load deck data.');
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
