// Minimal partial loader (TypeScript)
// Note: browsers don't run .ts directly — this is the TypeScript source. You will need to compile with tsc or a bundler for production.

async function loadPartial(el: HTMLElement) {
  const name = el.dataset.partial;
  if (!name) return;
  const url = `/public/partials/${name}.html`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Partial not found: ${url}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    el.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-partial]'));
  nodes.forEach(loadPartial);
});
