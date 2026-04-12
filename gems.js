/**
 * PW Gems Calculator - Mining Gems (index.html)
 * Handles gem count inputs, totals, byte coin calculations,
 * combined mode with fish page via localStorage.
 */


// Gems on this page
const GEMS_ON_PAGE = ['topaz', 'emerald', 'sapphire', 'ruby', 'diamond'];

document.addEventListener('DOMContentLoaded', () => {
  setupRows();
  setupCopyButtons();

  const rateInput = document.getElementById('bc-rate');
  if (rateInput) {
    rateInput.addEventListener('input', updateAllTotals);
    rateInput.addEventListener('change', updateAllTotals);
  }

  setupClearAllButton();
  updateAllTotals();
  animatePageIn();
  setupNavLinks();
  loadLogoFallback();
});

/* ─── LOGO FALLBACK ─── */
function loadLogoFallback() {
  const logo = document.getElementById('logo');
  if (!logo) return;
  logo.addEventListener('error', () => {
    const link = logo.closest('.logo-link');
    if (link) {
      link.innerHTML = '<span class="logo-fallback">⬡ PW Gems</span>';
    }
  });
}

/* ─── PAGE TRANSITION ─── */
function animatePageIn() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  overlay.style.opacity = '1';
  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.35s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.pointerEvents = 'none', 350);
  });
}

function setupNavLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && href.endsWith('.html')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = document.getElementById('page-transition');
        if (overlay) {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'all';
        }
        setTimeout(() => { window.location.href = href; }, 300);
      });
    }
  });
}

/* ─── ROW SETUP ─── */
function setupRows() {
  document.querySelectorAll('.gem-size-row').forEach(row => {
    const input = row.querySelector('.gem-input');
    const btnInc = row.querySelector('.btn-inc');
    const btnDec = row.querySelector('.btn-dec');
    const calcVal = row.querySelector('.calc-val');
    const valueLabel = row.querySelector('.gem-value-label');
    const gemVal = parseInt(row.dataset.value, 10) || 0;
    const gem = row.dataset.gem;

    function update() {
      let count = parseInt(input.value, 10) || 0;
      if (count < 0) { count = 0; input.value = 0; }
      const total = count * gemVal;
      calcVal.textContent = total.toLocaleString();
      if (count > 0) {
        valueLabel.classList.add('nonzero');
      } else {
        valueLabel.classList.remove('nonzero');
      }
      updateGemTotal(gem);
      updateMiningTotal();
    }

    btnInc.addEventListener('click', () => {
      input.value = (parseInt(input.value, 10) || 0) + 1;
      animateBtn(btnInc);
      update();
    });

    btnDec.addEventListener('click', () => {
      const val = (parseInt(input.value, 10) || 0) - 1;
      input.value = Math.max(0, val);
      animateBtn(btnDec);
      update();
    });

    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });
}

function animateBtn(btn) {
  btn.style.transform = 'scale(0.88)';
  setTimeout(() => btn.style.transform = '', 120);
}

/* ─── TOTALS CALCULATION ─── */
function getGemSubtotal(gem) {
  let total = 0;
  document.querySelectorAll(`.gem-size-row[data-gem="${gem}"]`).forEach(row => {
    const count = parseInt(row.querySelector('.gem-input').value, 10) || 0;
    const val = parseInt(row.dataset.value, 10) || 0;
    total += count * val;
  });
  return total;
}

function updateGemTotal(gem) {
  const total = getGemSubtotal(gem);
  const el = document.getElementById(`${gem}-total`);
  if (el) {
    el.textContent = total.toLocaleString();
    pulseValue(el);
    if (total > 0) {
      el.style.color = 'var(--color-success)';
    } else {
      el.style.color = '';
    }
  }
}

function updateMiningTotal() {
  let grandTotal = 0;
  GEMS_ON_PAGE.forEach(gem => {
    grandTotal += getGemSubtotal(gem);
  });

  setEl('mining-total-gems', grandTotal.toLocaleString());

  const rateInput = document.getElementById('bc-rate');
  const rate = rateInput ? (parseFloat(rateInput.value) || 0) : 230;
  const bc = Math.round(grandTotal * (rate / 1000));

  setEl('mining-byte-coins', bc.toLocaleString());
}

function updateAllTotals() {
  GEMS_ON_PAGE.forEach(gem => updateGemTotal(gem));
  updateMiningTotal();
}



/* ─── COPY BUTTONS ─── */
function setupCopyButtons() {
  setupCopy('copy-mining-gems', () => document.getElementById('mining-total-gems')?.textContent || '0');
}

function setupClearAllButton() {
  const btn = document.getElementById('clear-mining-gems');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gem-size-row').forEach(row => {
      const input = row.querySelector('.gem-input');
      const calcVal = row.querySelector('.calc-val');
      const valueLabel = row.querySelector('.gem-value-label');
      if (input) input.value = '0';
      if (calcVal) calcVal.textContent = '0';
      if (valueLabel) valueLabel.classList.remove('nonzero');
    });
    updateAllTotals();
  });
}

function setupCopy(id, valueFn) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const val = valueFn().replace(/,/g, '');
    navigator.clipboard.writeText(val).then(() => {
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1500);
    });
  });
}

/* ─── HELPERS ─── */
function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    pulseValue(el);
  }
}

function pulseValue(el) {
  el.classList.remove('value-pulse');
  void el.offsetWidth; // reflow
  el.classList.add('value-pulse');
  setTimeout(() => el.classList.remove('value-pulse'), 250);
}
