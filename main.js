// ============================
// main.js - All site functions
// ============================

// --- Fetch data ---
async function fetchData() {
  const res = await fetch('db.json');
  return await res.json();
}

// --- Product Search + Cart ---
let cart = [];

async function searchMedicine() {
  const query = document.getElementById('searchBox').value.toLowerCase();
  const data = await fetchData();
  const results = data.medicines.filter(m => m.name.toLowerCase().includes(query));

  const container = document.getElementById('searchResults');
  container.innerHTML = results.length
    ? results.map(m => `<p>${m.name} - $${m.price} <button onclick="addToCart('${m.name}', ${m.price})">Add</button></p>`).join('')
    : `<p>No results found.</p>`;
}

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  container.innerHTML = cart.map((item, i) => `<p>${item.name} - $${item.price} <button onclick="removeFromCart(${i})">Remove</button></p>`).join('');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("🎉 Order placed successfully! Your order ID is 101");
  cart = [];
  renderCart();
}

// --- Order Tracking ---
async function trackOrder() {
  const id = parseInt(document.getElementById('orderId').value);
  const data = await fetchData();
  const order = data.orders.find(o => o.id === id);

  document.getElementById('orderStatus').innerHTML = order
    ? `<p>Order #${order.id} → Status: <strong>${order.status}</strong></p>`
    : `<p>❌ Order not found.</p>`;
}

// --- Pharmacy Login + Stock Management ---
async function pharmacyLogin() {
  const password = document.getElementById('pharmacyPassword').value;
  if (password === "pharmacy123") {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('stockSection').style.display = "block";
    loadPharmacyStock();
  } else {
    alert("❌ Wrong password.");
  }
}

async function loadPharmacyStock() {
  const data = await fetchData();
  const stockContainer = document.getElementById('pharmacyStock');
  stockContainer.innerHTML = data.medicines.map(m => `<p>${m.name} - $${m.price}</p>`).join('');
}

function addMedicine() {
  const name = document.getElementById('newMedicineName').value;
  const price = document.getElementById('newMedicinePrice').value;
  if (name && price) {
    alert(`✅ ${name} added at $${price} (simulation only)`);
  } else {
    alert("⚠️ Please enter both name and price");
  }
}

// --- Dashboard ---
async function loadDashboard() {
  const data = await fetchData();
  if (document.getElementById('salesData')) {
    document.getElementById('salesData').innerHTML = `<h3>Sales</h3><p>Total Orders: ${data.sales.totalOrders}</p><p>Revenue: $${data.sales.revenue}</p>`;
    document.getElementById('inventoryData').innerHTML = `<h3>Inventory</h3><p>Medicines in stock: ${data.medicines.length}</p>`;
  }
}

loadDashboard();
