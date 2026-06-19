/* ── GLITTERGLOW – MAIN JS ── */

/* ─── Glitter particle generator ─── */
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#c0392b','#ffffff','#1a3a6b','#f39c12','#e74c3c','#3498db','#f5f5f5'];
  const count  = 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 6 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tx    = (Math.random() - 0.5) * 200;
    const ty    = -(Math.random() * 160 + 40);
    const dur   = (Math.random() * 2 + 1.5).toFixed(2) + 's';
    const delay = (Math.random() * 3).toFixed(2) + 's';
    const left  = Math.random() * 100;
    const top   = Math.random() * 100;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      top: ${top}%;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --dur: ${dur};
      --delay: ${delay};
      animation-delay: ${delay};
    `;
    container.appendChild(p);
  }
}
spawnParticles();

/* ─── Cart state ─── */
const cart = { items: [] };

function addToCart(style, qty) {
  const existing = cart.items.find(i => i.style === style);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ style, qty, price: 11.15 });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(style) {
  cart.items = cart.items.filter(i => i.style !== style);
  updateCartUI();
}

function updateCartUI() {
  const total = cart.items.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;

  const body    = document.getElementById('cartBody');
  const empty   = document.getElementById('cartEmpty');
  const items   = document.getElementById('cartItems');
  const footer  = document.getElementById('cartFooter');
  const subtotalEl = document.getElementById('cartSubtotal');

  if (cart.items.length === 0) {
    empty.style.display  = 'block';
    items.style.display  = 'none';
    footer.style.display = 'none';
    return;
  }

  empty.style.display  = 'none';
  items.style.display  = 'block';
  footer.style.display = 'block';

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  subtotalEl.textContent = '$' + subtotal.toFixed(2);

  items.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb"></div>
      <div class="cart-item-info">
        <h4>4th of July Glitter Stick</h4>
        <p>${item.style} · Qty: ${item.qty}</p>
        <div class="cart-item-row">
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          <button class="cart-item-remove" onclick="removeFromCart('${item.style}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── Cart drawer ─── */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

/* ─── Toast ─── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ─── Quantity control ─── */
let qty = 1;

document.getElementById('qtyMinus').addEventListener('click', () => {
  if (qty > 1) qty--;
  document.getElementById('qtyValue').textContent = qty;
});

document.getElementById('qtyPlus').addEventListener('click', () => {
  if (qty < 10) qty++;
  document.getElementById('qtyValue').textContent = qty;
});

/* ─── Style chips ─── */
let selectedStyle = 'Hexagon Glitter';

document.getElementById('styleChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;

  document.querySelectorAll('#styleChips .chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  selectedStyle = chip.dataset.value;
  document.getElementById('selectedStyle').textContent = selectedStyle;
});

/* ─── Add to cart / Buy now ─── */
document.getElementById('addToCartBtn').addEventListener('click', () => {
  addToCart(selectedStyle, qty);
  showToast('✓ Added to cart!');
});

document.getElementById('buyNowBtn').addEventListener('click', () => {
  addToCart(selectedStyle, qty);
  handleCheckout();
});

document.getElementById('ctaBuyBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    addToCart(selectedStyle, qty);
  }, 600);
});

function handleCheckout() {
  showToast('Redirecting to checkout…');
  closeCart();
  setTimeout(() => {
    alert('Checkout coming soon!\n\nThis is a demo page. Integrate Shopify, WooCommerce, or TikTok Shop checkout here.');
  }, 800);
}

/* ─── Thumbnail gallery switcher ─── */
const thumbMeta = [
  { bg: 'linear-gradient(135deg,#c0392b 33%,#f5f5f5 33% 66%,#1a3a6b 66%)', label: 'Main product' },
  { bg: 'linear-gradient(135deg,#f9f9f9,#e0e0e0)', label: 'Application demo' },
  { bg: 'radial-gradient(circle,#f39c12,#c0392b)', label: 'Hexagon glitter' },
  { bg: 'radial-gradient(circle,#1a3a6b,#2c3e50)', label: 'Star glitter' },
];

document.getElementById('thumbnails').addEventListener('click', e => {
  const thumb = e.target.closest('.thumb');
  if (!thumb) return;

  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');

  const idx     = Number(thumb.dataset.idx);
  const visual  = document.getElementById('productVisual');
  const meta    = thumbMeta[idx];

  visual.style.background = meta.bg;
  if (idx === 0) {
    visual.innerHTML = `
      <div class="glitter-can">
        <div class="can-body">
          <div class="can-label">
            <div class="stripe red"></div>
            <div class="stripe white"></div>
            <div class="stripe blue"></div>
            <div class="can-stars">★ ★ ★</div>
            <div class="can-text">GLITTER<br>STICK</div>
            <div class="can-sub">4th of July Edition</div>
          </div>
        </div>
        <div class="can-cap"></div>
        <div class="glitter-particles" id="particles"></div>
      </div>
    `;
    spawnParticles();
  } else if (idx === 1) {
    visual.innerHTML = `<div style="text-align:center;color:#555;padding:20px">
      <div style="font-size:5rem">✨</div>
      <p style="font-size:.9rem;margin-top:12px">Glide-On Application<br><small>No glue needed</small></p>
    </div>`;
  } else if (idx === 2) {
    visual.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:4rem">⬡</div>
      <p style="font-size:.9rem;margin-top:12px;color:#555">Hexagon Glitter Style</p>
      <div style="font-size:2rem;margin-top:8px">🔴⚪🔵</div>
    </div>`;
  } else {
    visual.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:4rem">⭐</div>
      <p style="font-size:.9rem;margin-top:12px;color:#555">Star Glitter Style</p>
      <div style="font-size:2rem;margin-top:8px">🔴⚪🔵</div>
    </div>`;
  }
});

/* ─── FAQ accordion ─── */
document.getElementById('faqList').addEventListener('click', e => {
  const btn = e.target.closest('.faq-question');
  if (!btn) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const answer = btn.nextElementSibling;

  document.querySelectorAll('.faq-question').forEach(b => {
    b.setAttribute('aria-expanded', 'false');
    b.nextElementSibling.classList.remove('open');
  });

  if (!isOpen) {
    btn.setAttribute('aria-expanded', 'true');
    answer.classList.add('open');
  }
});

/* ─── Countdown timer (48-hour rolling sale) ─── */
function updateCountdown() {
  const now      = new Date();
  const end      = new Date(now);
  end.setHours(23, 59, 59, 999);

  let diff = end - now;
  if (diff < 0) diff = 0;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById('cdH').textContent = String(h).padStart(2, '0');
  document.getElementById('cdM').textContent = String(m).padStart(2, '0');
  document.getElementById('cdS').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── Sticky header shadow on scroll ─── */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,.1)';
  } else {
    header.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)';
  }
});

/* ─── Scroll-in fade animations ─── */
const fadeEls = document.querySelectorAll(
  '.feature-card, .review-card, .usp-item, .faq-item, .specs-table'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));
