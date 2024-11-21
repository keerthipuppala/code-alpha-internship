const products = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
];

const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');

let cartItems = [];

function displayProducts() {
    productList.innerHTML = products.map(product => `
        <div class="product">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cartItems.push(product);
    displayCart();
}

function displayCart() {
    cart.innerHTML = `
        <h2>Shopping Cart</h2>
        ${cartItems.map(item => `
            <p>${item.name} - $${item.price}</p>
        `).join('')}
        <p>Total: $${cartItems.reduce((sum, item) => sum + item.price, 0)}</p>
    `;
}

displayProducts();
