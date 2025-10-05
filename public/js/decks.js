let decksIndex = [];
function createCard(deck) {
    const card = document.createElement('article');
    card.className = 'deck-card';
    const title = document.createElement('h3');
    title.textContent = deck.name;
    card.appendChild(title);
    const desc = document.createElement('p');
    desc.textContent = deck.description;
    card.appendChild(desc);
    const view = document.createElement('a');
    view.href = `./deck.html?i=${encodeURIComponent(deck.index)}`;
    view.className = 'btn ghost';
    view.textContent = 'View';
    card.appendChild(view);
    return card;
}
function renderResults(list, resultsEl) {
    resultsEl.innerHTML = '';
    if (!list.length) {
        resultsEl.innerHTML = '<p>No decks match.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'deck-grid';
    list.forEach((d) => {
        const card = createCard(d);
        grid.appendChild(card);
    });
    resultsEl.appendChild(grid);
}
function applyFilter(searchEl, resultsEl) {
    const q = (searchEl.value || '').trim().toLowerCase();
    if (!q)
        return renderResults(decksIndex, resultsEl);
    deckService.searchIndex(q).then((filtered) => {
        renderResults(filtered, resultsEl);
    }).catch((err) => {
        console.error(err);
        resultsEl.innerHTML = '<p>Unable to filter decks.</p>';
    });
}
async function init() {
    const resultsEl = document.getElementById('deck-results');
    const searchEl = document.getElementById('deck-search');
    if (!resultsEl || !searchEl)
        return;
    try {
        decksIndex = await deckService.fetchIndex();
        renderResults(decksIndex, resultsEl);
    }
    catch (err) {
        resultsEl.innerHTML = '<p>Unable to load decks.</p>';
        console.error(err);
    }
    searchEl.addEventListener('input', () => applyFilter(searchEl, resultsEl));
}
document.addEventListener('DOMContentLoaded', init);
export {};
//# sourceMappingURL=decks.js.map