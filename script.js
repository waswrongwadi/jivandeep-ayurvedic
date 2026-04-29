// ========== PRODUCT DATA ==========
let products = [
  { id: 1, name: "Ashwagandha Capsules", price: 450, category: "Herbal Supplements", description: "Stress relief and vitality support", stock: true, image: "🌿", imageUrl: "" },
  { id: 2, name: "Triphala Churna", price: 320, category: "Digestive Care", description: "Gentle detox and digestive health", stock: true, image: "🍃", imageUrl: "" },
  { id: 3, name: "Brahmi Syrup", price: 280, category: "Brain Health", description: "Memory and concentration booster", stock: true, image: "🧠", imageUrl: "" },
  { id: 4, name: "Chyawanprash", price: 550, category: "Immunity", description: "Traditional ayurvedic jam for immunity", stock: true, image: "🍯", imageUrl: "" },
  { id: 5, name: "Neem Capsules", price: 380, category: "Skin Care", description: "Blood purifier and skin health", stock: false, image: "🌱", imageUrl: "" },
  { id: 6, name: "Tulsi Drops", price: 220, category: "Respiratory", description: "Natural support for cough and cold", stock: true, image: "🌿", imageUrl: "" },
  { id: 7, name: "Guggul Tablets", price: 420, category: "Joint Health", description: "Supports healthy joints and cholesterol", stock: true, image: "💪", imageUrl: "" },
  { id: 8, name: "Shilajit Resin", price: 890, category: "Herbal Supplements", description: "Natural mineral pitch for energy", stock: true, image: "⚡", imageUrl: "" },
  { id: 9, name: "Dashmool Kwath", price: 350, category: "Pain Relief", description: "Herbal decoction for body ache", stock: false, image: "🌿", imageUrl: "" },
  { id: 10, name: "Kali Mirch Tablets", price: 180, category: "Digestive Care", description: "Improves digestion and metabolism", stock: true, image: "🫚", imageUrl: "" },
  { id: 11, name: "Amla Juice", price: 290, category: "Immunity", description: "Rich in Vitamin C, antioxidant", stock: true, image: "🍊", imageUrl: "" },
  { id: 12, name: "Moringa Powder", price: 400, category: "Herbal Supplements", description: "Nutrient-dense superfood", stock: true, image: "🥬", imageUrl: "" }
];

let cart = [];

// ========== LOAD DATA ==========
function loadData() {
  const savedProducts = localStorage.getItem('jivandeep_products');
  const savedCart = localStorage.getItem('jivandeep_cart');
  if (savedProducts) products = JSON.parse(savedProducts);
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartCount();
}

function saveProducts() { localStorage.setItem('jivandeep_products', JSON.stringify(products)); }
function saveCart() { localStorage.setItem('jivandeep_cart', JSON.stringify(cart)); updateCartCount(); }

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => { if (el) el.textContent = count; });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || !product.stock) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity++;
  else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
  saveCart();
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCartDrawer();
}

function updateCartQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(productId);
    else { saveCart(); renderCartDrawer(); }
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px;">Your cart is empty</div>';
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info"><h4>${item.name}</h4><p>₹${item.price} × ${item.quantity}</p></div>
      <div class="cart-item-actions">
        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})" style="background:none; color:var(--error);">🗑️</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalEl) totalEl.textContent = `₹${total}`;
}

function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('active');
}
function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function openCheckoutModal() {
  if (cart.length === 0) { alert("Your cart is empty"); return; }
  document.getElementById('checkoutModal')?.classList.add('active');
  closeCartDrawer();
}
function closeCheckoutModal() { document.getElementById('checkoutModal')?.classList.remove('active'); }

function placeOrder() {
  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  if (!name || !phone || !address) { alert("Please fill in all fields"); return; }
  if (phone.length < 10) { alert("Please enter a valid phone number"); return; }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let itemsList = "";
  cart.forEach(item => { itemsList += `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`; });
  
  const orderSummary = `🆕 NEW ORDER FROM JIVANDEEP AYURVEDIC\n\n👤 Customer: ${name}\n📞 Phone: ${phone}\n📍 Address: ${address}\n\n🛒 Order Items:\n${itemsList}\n💰 Total Amount: ₹${total}\n⏰ Order Date: ${new Date().toLocaleString()}`;
  
  const orders = JSON.parse(localStorage.getItem('jivandeep_orders') || '[]');
  orders.unshift({ id: Date.now(), customer: name, phone, address, items: [...cart], total, date: new Date().toISOString(), status: 'pending', read: false });
  localStorage.setItem('jivandeep_orders', JSON.stringify(orders));
  
  const whatsappNumber = "917412261052";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderSummary)}`, '_blank');
  
  cart = [];
  saveCart();
  renderCartDrawer();
  updateCartCount();
  closeCheckoutModal();
  document.getElementById('checkoutName').value = '';
  document.getElementById('checkoutPhone').value = '';
  document.getElementById('checkoutAddress').value = '';
  alert("Order placed! You will be redirected to WhatsApp to confirm.");
}

function renderProducts(filterCategory = 'all') {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  let filtered = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);
  if (filtered.length === 0) { container.innerHTML = '<div style="text-align:center; padding:60px;">No products found</div>'; return; }
  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-image">${product.image}</div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-title">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">₹${product.price}</div>
        <span class="stock-badge ${product.stock ? 'stock-in' : 'stock-out'}">${product.stock ? 'In Stock' : 'Out of Stock'}</span>
        <button class="add-to-cart-btn ${!product.stock ? 'disabled' : ''}" onclick="addToCart(${product.id})" ${!product.stock ? 'disabled' : ''}>${product.stock ? 'Add to Cart' : 'Out of Stock'}</button>
      </div>
    </div>
  `).join('');
  setTimeout(() => checkVisibility(), 100);
}

function checkVisibility() {
  document.querySelectorAll('.fade-up, .product-card, .section-header').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('visible');
  });
}

// ========== MOBILE MENU - SIMPLE FIXED VERSION ==========
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (menuBtn && mobileNav) {
    // Force the mobile nav to have absolute positioning and be above everything
    mobileNav.style.position = 'absolute';
    mobileNav.style.top = '100%';
    mobileNav.style.left = '0';
    mobileNav.style.right = '0';
    mobileNav.style.backgroundColor = 'white';
    mobileNav.style.padding = '20px';
    mobileNav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    mobileNav.style.zIndex = '1000';
    
    // Initially hidden
    mobileNav.style.display = 'none';
    
    menuBtn.onclick = function(e) {
      e.preventDefault();
      if (mobileNav.style.display === 'none' || mobileNav.style.display === '') {
        mobileNav.style.display = 'block';
        menuBtn.textContent = '✕';
      } else {
        mobileNav.style.display = 'none';
        menuBtn.textContent = '☰';
      }
    };
    
    // Close when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.onclick = function() {
        mobileNav.style.display = 'none';
        menuBtn.textContent = '☰';
      };
    });
  }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  renderCartDrawer();
  updateCartCount();
  setupMobileMenu();
  
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', function() {
    checkVisibility();
    setTimeout(checkVisibility, 300);
  });
  
  const overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.onclick = closeCartDrawer;
});
