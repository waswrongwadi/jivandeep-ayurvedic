// ========== ADMIN AUTHENTICATION ==========
const ADMIN_PASSWORD = "jivandeep2025";

// ========== LOAD DATA ==========
let products = [];
let orders = [];

function loadAdminData() {
  const savedProducts = localStorage.getItem('jivandeep_products');
  const savedOrders = localStorage.getItem('jivandeep_orders');
  
  if (savedProducts) {
    products = JSON.parse(savedProducts);
  } else {
    products = [
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
    saveProducts();
  }
  
  if (savedOrders) {
    orders = JSON.parse(savedOrders);
  } else {
    orders = [];
    saveOrders();
  }
}

function saveProducts() {
  localStorage.setItem('jivandeep_products', JSON.stringify(products));
  // Also update the global products variable in script.js for shop page
  if (typeof window.updateGlobalProducts === 'function') {
    window.updateGlobalProducts(products);
  }
}

function saveOrders() {
  localStorage.setItem('jivandeep_orders', JSON.stringify(orders));
}

// ========== RENDER PRODUCTS TABLE ==========
function renderProductsTable() {
  const container = document.getElementById('productsTableContainer');
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<p>No products added yet. Add your first product below.</p>';
    return;
  }
  
  let tableHtml = `
    <table class="products-table" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr><th style="padding:10px; text-align:left; background:#f0f0f0;">ID</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Name</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Category</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Price</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Stock</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Description</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  products.forEach(product => {
    tableHtml += `
      <tr style="border-bottom:1px solid #ddd;">
        <td style="padding:10px;">${product.id}</td>
        <td style="padding:10px;"><strong>${escapeHtml(product.name)}</strong></td>
        <td style="padding:10px;">${escapeHtml(product.category)}</td>
        <td style="padding:10px;">₹${product.price}</td>
        <td style="padding:10px;">${product.stock ? '✅ In Stock' : '❌ Out of Stock'}</td>
        <td style="padding:10px; max-width:250px;">${escapeHtml(product.description.substring(0, 60))}${product.description.length > 60 ? '...' : ''}</td>
        <td style="padding:10px;">
          <button class="edit-product-btn" data-id="${product.id}" style="background:#4CAF50; color:white; border:none; padding:6px 12px; margin:2px; border-radius:4px; cursor:pointer;">✏️ Edit</button>
          <button class="delete-product-btn" data-id="${product.id}" style="background:#f44336; color:white; border:none; padding:6px 12px; margin:2px; border-radius:4px; cursor:pointer;">🗑️ Delete</button>
        </td>
      </tr>
    `;
  });
  
  tableHtml += `</tbody></table>`;
  container.innerHTML = tableHtml;
  
  // Attach event listeners to edit buttons
  document.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      editProductById(id);
    });
  });
  
  // Attach event listeners to delete buttons
  document.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      deleteProductById(id);
    });
  });
}

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========== EDIT PRODUCT - FIXED VERSION ==========
function editProductById(id) {
  const product = products.find(p => p.id === id);
  if (!product) {
    alert("Product not found");
    return;
  }
  
  // Name
  let newName = prompt("Edit Product Name:", product.name);
  if (newName === null) return;
  newName = newName.trim();
  if (newName === "") { alert("Name cannot be empty"); return; }
  
  // Price
  let newPrice = prompt("Edit Price (₹):", product.price);
  if (newPrice === null) return;
  newPrice = parseFloat(newPrice);
  if (isNaN(newPrice) || newPrice <= 0) { alert("Please enter a valid price"); return; }
  
  // Category
  let newCategory = prompt("Edit Category:", product.category);
  if (newCategory === null) return;
  newCategory = newCategory.trim();
  if (newCategory === "") { alert("Category cannot be empty"); return; }
  
  // Description
  let newDescription = prompt("Edit Description:", product.description);
  if (newDescription === null) return;
  newDescription = newDescription.trim();
  if (newDescription === "") { alert("Description cannot be empty"); return; }
  
  // Stock status
  const stockStatus = confirm(`Is "${product.name}" currently IN STOCK?\n\nClick OK for IN STOCK\nClick Cancel for OUT OF STOCK`);
  
  // Update product
  product.name = newName;
  product.price = newPrice;
  product.category = newCategory;
  product.description = newDescription;
  product.stock = stockStatus;
  
  saveProducts();
  renderProductsTable();
  alert(`✅ "${product.name}" has been updated successfully!`);
}

// ========== DELETE PRODUCT - FIXED VERSION ==========
function deleteProductById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProductsTable();
    alert(`"${product.name}" has been deleted.`);
  }
}

// ========== ADD NEW PRODUCT ==========
function addProduct() {
  const name = document.getElementById('productName')?.value.trim();
  const price = parseFloat(document.getElementById('productPrice')?.value);
  const category = document.getElementById('productCategory')?.value;
  const description = document.getElementById('productDescription')?.value.trim();
  const stock = document.getElementById('productStock')?.value === 'true';
  const image = document.getElementById('productImage')?.value.trim() || '🌿';
  
  if (!name) { alert("Please enter product name"); return; }
  if (isNaN(price) || price <= 0) { alert("Please enter a valid price"); return; }
  if (!category) { alert("Please select a category"); return; }
  if (!description) { alert("Please enter description"); return; }
  
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 13;
  
  products.push({
    id: newId,
    name: name,
    price: price,
    category: category,
    description: description,
    stock: stock,
    image: image,
    imageUrl: ""
  });
  
  saveProducts();
  renderProductsTable();
  
  // Clear form
  if (document.getElementById('productName')) document.getElementById('productName').value = '';
  if (document.getElementById('productPrice')) document.getElementById('productPrice').value = '';
  if (document.getElementById('productCategory')) document.getElementById('productCategory').value = '';
  if (document.getElementById('productDescription')) document.getElementById('productDescription').value = '';
  if (document.getElementById('productStock')) document.getElementById('productStock').value = 'true';
  if (document.getElementById('productImage')) document.getElementById('productImage').value = '';
  
  alert(`"${name}" has been added successfully!`);
}

// ========== RENDER ORDERS TABLE ==========
function renderOrdersTable() {
  const container = document.getElementById('ordersTableContainer');
  const newOrdersBadge = document.getElementById('newOrdersBadge');
  
  if (!container) return;
  
  const unreadCount = orders.filter(o => !o.read).length;
  if (newOrdersBadge) {
    if (unreadCount > 0) {
      newOrdersBadge.innerHTML = ` 🔴 ${unreadCount} new`;
    } else {
      newOrdersBadge.innerHTML = '';
    }
  }
  
  if (orders.length === 0) {
    container.innerHTML = '<p>No orders received yet.</p>';
    return;
  }
  
  let tableHtml = `
    <table class="orders-table" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr><th style="padding:10px; text-align:left; background:#f0f0f0;">Order ID</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Customer</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Phone</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Items</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Total</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Date</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Status</th>
          <th style="padding:10px; text-align:left; background:#f0f0f0;">Action</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  orders.forEach(order => {
    const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    tableHtml += `
      <tr style="${!order.read ? 'background: #D4EADF;' : ''} border-bottom:1px solid #ddd;">
        <td style="padding:10px;">#${order.id}</td>
        <td style="padding:10px;">${escapeHtml(order.customer)}</td>
        <td style="padding:10px;">${order.phone}</td>
        <td style="padding:10px; max-width:200px;">${escapeHtml(itemsText.substring(0, 50))}${itemsText.length > 50 ? '...' : ''}</td>
        <td style="padding:10px;">₹${order.total}</td>
        <td style="padding:10px;">${new Date(order.date).toLocaleDateString()}</td>
        <td style="padding:10px;">
          <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding:5px; border-radius:4px;">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>✅ Confirmed</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>📦 Delivered</option>
          </select>
        </td>
        <td style="padding:10px;">
          <button onclick="markOrderRead(${order.id})" style="background:#2196F3; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">📖 Mark Read</button>
        </td>
      </tr>
    `;
  });
  
  tableHtml += `</tbody></table>`;
  container.innerHTML = tableHtml;
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders();
    renderOrdersTable();
    alert(`Order #${orderId} status updated to ${newStatus}`);
  }
}

function markOrderRead(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.read = true;
    saveOrders();
    renderOrdersTable();
  }
}

// ========== ADMIN LOGIN ==========
function adminLogin() {
  const password = document.getElementById('adminPassword')?.value;
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminPanel();
  } else {
    alert("Incorrect password");
  }
}

function showAdminPanel() {
  const loginSection = document.getElementById('loginSection');
  const adminPanel = document.getElementById('adminPanel');
  if (loginSection) loginSection.style.display = 'none';
  if (adminPanel) adminPanel.style.display = 'block';
  loadAdminData();
  renderProductsTable();
  renderOrdersTable();
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  const loginSection = document.getElementById('loginSection');
  const adminPanel = document.getElementById('adminPanel');
  if (loginSection) loginSection.style.display = 'block';
  if (adminPanel) adminPanel.style.display = 'none';
  const passwordInput = document.getElementById('adminPassword');
  if (passwordInput) passwordInput.value = '';
}

// ========== TAB SWITCHING ==========
function switchTab(tabName) {
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const section = document.getElementById(`${tabName}Section`);
  if (section) section.classList.add('active');
  
  // Find the clicked tab and add active class
  const tabs = document.querySelectorAll('.admin-tab');
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].innerText.toLowerCase().includes(tabName.toLowerCase())) {
      tabs[i].classList.add('active');
      break;
    }
  }
  
  if (tabName === 'orders') {
    renderOrdersTable();
  } else if (tabName === 'products') {
    renderProductsTable();
  }
}

// ========== MAKE FUNCTIONS GLOBAL FOR onclick ATTRIBUTES ==========
window.editProductById = editProductById;
window.deleteProductById = deleteProductById;
window.addProduct = addProduct;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.switchTab = switchTab;
window.updateOrderStatus = updateOrderStatus;
window.markOrderRead = markOrderRead;

// ========== CHECK LOGIN STATUS ON LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (isLoggedIn === 'true') {
    showAdminPanel();
  }
});

// ========== GLOBAL FUNCTION TO SYNC PRODUCTS WITH SHOP PAGE ==========
window.updateGlobalProducts = function(updatedProducts) {
  localStorage.setItem('jivandeep_products', JSON.stringify(updatedProducts));
};
