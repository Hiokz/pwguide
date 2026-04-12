/**
 * PW Gems Calculator - Fish Gems (fish.html)
 * Handles fish gem count inputs, totals, byte coin calculations,
 * combined mode with mining page via localStorage.
 */


// Fish on this page
const FISH_ON_PAGE = [
  'kingfish', 'piranha', 'dumbfish', 'goldfish', 'acidpuffer',
  'herring', 'butterflyfish', 'carp', 'tuna', 'seaangler', 'halibut', 'crab'
];

document.addEventListener('DOMContentLoaded', () => {
  setupRows();
  setupCopyButtons();

  const rateInput = document.getElementById('bc-rate');
  if (rateInput) {
    rateInput.addEventListener('input', updateAllTotals);
    rateInput.addEventListener('change', updateAllTotals);
  }

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
    const fish = row.dataset.gem;

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
      updateFishTotal(fish);
      updateFishGrandTotal();
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
function getFishSubtotal(fish) {
  let total = 0;
  document.querySelectorAll(`.gem-size-row[data-gem="${fish}"]`).forEach(row => {
    const count = parseInt(row.querySelector('.gem-input').value, 10) || 0;
    const val = parseInt(row.dataset.value, 10) || 0;
    total += count * val;
  });
  return total;
}

function updateFishTotal(fish) {
  const total = getFishSubtotal(fish);
  const el = document.getElementById(`${fish}-total`);
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

function updateFishGrandTotal() {
  let grandTotal = 0;
  FISH_ON_PAGE.forEach(fish => {
    grandTotal += getFishSubtotal(fish);
  });

  setEl('fish-total-gems', grandTotal.toLocaleString());

  const rateInput = document.getElementById('bc-rate');
  const rate = rateInput ? (parseFloat(rateInput.value) || 0) : 230;
  const bc = Math.round(grandTotal * (rate / 1000));

  setEl('fish-byte-coins', bc.toLocaleString());
}

function updateAllTotals() {
  FISH_ON_PAGE.forEach(fish => updateFishTotal(fish));
  updateFishGrandTotal();
}



/* ─── COPY BUTTONS ─── */
function setupCopyButtons() {
  setupCopy('copy-fish-gems', () => document.getElementById('fish-total-gems')?.textContent || '0');
  setupCopy('copy-fish-bc', () => document.getElementById('fish-byte-coins')?.textContent || '0');
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
