const instances = new WeakMap();

/** Framework-free controls. For React-controlled lists use React state instead. */
export function initControls(root = document.documentElement) {
  instances.get(root)?.destroy();
  const doc = root.ownerDocument || root;
  const win = doc.defaultView;
  if (!win) return { destroy() {} };
  const cleanups = [];

  root.querySelectorAll('[data-vink-filter-group]').forEach(group => {
    const buttons = [...group.querySelectorAll('button[data-vink-filter]')];
    const items = [...group.querySelectorAll('[data-vink-filter-item]')];
    const status = group.querySelector('[data-vink-filter-status]');
    const previous = {
      buttons: buttons.map(el => el.getAttribute('aria-pressed')),
      hidden: items.map(el => el.hidden),
      status: status?.textContent,
    };
    const apply = chosen => {
      let count = 0;
      const selected = chosen.dataset.vinkFilter;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button === chosen)));
      items.forEach(item => {
        const tags = (item.dataset.vinkFilterItem || '').split(/\s+/);
        item.hidden = selected !== 'all' && !tags.includes(selected);
        if (!item.hidden) count++;
      });
      if (status) status.textContent = `${count} ${count === 1 ? 'resultado' : 'resultados'}`;
      group.dispatchEvent(new win.CustomEvent('vink:layout', { bubbles: true }));
    };
    buttons.forEach(button => {
      const click = () => apply(button);
      button.addEventListener('click', click);
      cleanups.push(() => button.removeEventListener('click', click));
    });
    const initial = buttons.find(button => button.getAttribute('aria-pressed') === 'true')
      || buttons.find(button => button.dataset.vinkFilter === 'all');
    if (initial) apply(initial);
    cleanups.push(() => {
      buttons.forEach((el, i) => previous.buttons[i] === null
        ? el.removeAttribute('aria-pressed') : el.setAttribute('aria-pressed', previous.buttons[i]));
      items.forEach((el, i) => { el.hidden = previous.hidden[i]; });
      if (status) status.textContent = previous.status;
    });
  });

  root.querySelectorAll('[data-vink-compare]').forEach(compare => {
    const range = compare.querySelector('input[type="range"][data-vink-compare-range]');
    if (!range) return;
    const before = compare.style.getPropertyValue('--vink-compare');
    const previousText = range.getAttribute('aria-valuetext');
    const update = () => {
      const min = Number(range.min || 0);
      const max = Number(range.max || 100);
      const raw = max > min ? ((Number(range.value) - min) / (max - min)) * 100 : 50;
      const percentage = Math.round(Math.min(100, Math.max(0, raw)));
      compare.style.setProperty('--vink-compare', `${percentage}%`);
      range.setAttribute('aria-valuetext', `${percentage}% de la segunda vista`);
    };
    range.addEventListener('input', update);
    update();
    cleanups.push(() => {
      range.removeEventListener('input', update);
      before ? compare.style.setProperty('--vink-compare', before)
        : compare.style.removeProperty('--vink-compare');
      previousText === null ? range.removeAttribute('aria-valuetext')
        : range.setAttribute('aria-valuetext', previousText);
    });
  });

  let stopped = false;
  const handle = {
    destroy() {
      if (stopped) return;
      stopped = true;
      cleanups.splice(0).forEach(fn => fn());
      if (instances.get(root) === handle) instances.delete(root);
    },
  };
  instances.set(root, handle);
  return handle;
}
