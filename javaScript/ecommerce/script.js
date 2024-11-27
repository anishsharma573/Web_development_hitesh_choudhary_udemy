document.addEventListener('DOMContentLoaded', () => {
  const products = [
      { id: 1, name: "Product 1", price: 29.99 },
      { id: 2, name: "Product 2", price: 49.99 },
      { id: 3, name: "Product 3", price: 279.99 },
  ];

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const productList = document.getElementById("product-list");
  const cartItem = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutButton = document.getElementById("checkout-btn");

  products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
          <span>${product.name} - $${product.price.toFixed(2)}</span>
          <button data-id="${product.id}">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
  });

  renderCart();

  productList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
          const productId = parseInt(e.target.getAttribute('data-id'));
          const product = products.find(p => p.id === productId);
          addToCart(product);
      }
  });

  function addToCart(product) {
      cart.push(product);
      saveCart();
      renderCart();
  }

  function removeFromCart(productId) {
      const index = cart.findIndex(product => product.id === productId);
      if (index !== -1) {
          cart.splice(index, 1);
      }
      saveCart();
      renderCart();
  }

  function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
      cartItem.innerHTML = "";
      let totalPrice = 0;

      if (cart.length > 0) {
          emptyCartMessage.classList.add('hidden');
          cartTotal.classList.remove('hidden');

          cart.forEach(product => {
              const cartDiv = document.createElement('div');
              cartDiv.innerHTML = `
                  <span>${product.name}</span> - $${product.price.toFixed(2)}
                  <button class="btn" data-id="${product.id}">Delete</button>
              `;
              cartItem.appendChild(cartDiv);

              totalPrice += product.price;
          });

          totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
      } else {
          emptyCartMessage.classList.remove('hidden');
          cartTotal.classList.add('hidden');
      }
  }

  cartItem.addEventListener('click', (e) => {
      if (e.target.tagName === "BUTTON") {
          const productId = parseInt(e.target.getAttribute('data-id'));
          removeFromCart(productId);
      }
  });
});
