fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const productGrid = document.getElementById("product-grid");
    const cartContainer = document.querySelector(".cart");
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal");
    document.body.appendChild(modalContainer);
    let cartItems = {};

    // Update Cart Count Display
    function updateCartCount() {
      const cartCount = Object.keys(cartItems).length;
      document.querySelector(
        "#cartTitle"
      ).textContent = `Your Cart (${cartCount})`;
    }

    // Function to display cart items
    function displayCartItems() {
      const orderTotal = Object.values(cartItems).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      cartContainer.innerHTML = `
        <p id="cartTitle">Your Cart (${Object.keys(cartItems).length})</p>
        ${
          Object.keys(cartItems).length === 0
            ? '<img src="./images/illustration-empty-cart.svg" alt="empty"><p>Your added items will appear here</p>'
            : Object.values(cartItems)
                .map(
                  (item) => `
                    <div class="cart-item">
                      <p class="cart-item-name">${item.name}</p>
                      <p class="cart-item-details">${
                        item.quantity
                      }x @ $${item.price.toFixed(2)}  = $${(
                    item.price * item.quantity
                  ).toFixed(2)}</p>
                    </div>
                    <hr class="item-divider"/>
                  `
                )
                .join("") +
              `
            <div class="order-total">
              <h4><strong>Order Total</strong></h4>
              <p> $${orderTotal.toFixed(2)}</p>
            </div>
            `
        }
      `;
      updateCartCount();

      if (Object.keys(cartItems).length > 0) {
        const confirmOrderButton = document.createElement("button");
        confirmOrderButton.classList.add("confirm-order");
        confirmOrderButton.textContent = "Confirm Order";

        confirmOrderButton.addEventListener("click", displayModal);
        cartContainer.appendChild(confirmOrderButton);
      }
    }

    // Display Modal on Confirm Order
    function displayModal() {
      const orderTotal = Object.values(cartItems).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      modalContainer.innerHTML = `
        <div class="modal-content">
          <h2>Order Confirmed</h2>
          <p>Thank you for your purchase! Here is your order:</p>
          <div class="modal-items">
            ${Object.values(cartItems)
              .map(
                (item) => `
                  <div class="modal-item">
                    <p class="modal-item-name">${item.name}</p>
                    <p class="modal-item-details">${
                      item.quantity
                    }x @ $${item.price.toFixed(2)} = $${(
                  item.price * item.quantity
                ).toFixed(2)}</p>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="order-total">
            <h4><strong>Order Total</strong></h4>
            <p> $${orderTotal.toFixed(2)}</p>
          </div>
          <button id="newOrderButton">Start New Order</button>
        </div>
      `;

      modalContainer.style.display = "flex";

      document
        .getElementById("newOrderButton")
        .addEventListener("click", () => {
          cartItems = {};
          modalContainer.style.display = "none";
          displayCartItems();
          resetProductGrid();
        });
    }

    function resetProductGrid() {
      document.querySelectorAll(".product-item").forEach((item) => {
        const addToCartButton = item.querySelector(".add-to-cart");

        // Reset "Add to Cart" button styles to their default state

        addToCartButton.style.display = "flex";
        addToCartButton.style.justifyContent = "center";
        addToCartButton.style.alignItems = "center";
        addToCartButton.style.padding = "2px";
        addToCartButton.style.gap = "6px";
        addToCartButton.style.width = "60%";
        addToCartButton.style.border = "1px solid var(--Rose-500)";
        addToCartButton.style.borderRadius = "12px";
        addToCartButton.style.position = "absolute";
        addToCartButton.style.cursor = "pointer";
        addToCartButton.style.bottom = "62px";
        addToCartButton.style.left = "50%";
        addToCartButton.style.transform = "translateX(-50%)";

        // Reset button text and icon
        addToCartButton.innerHTML = `
          <img src="./images/icon-add-to-cart.svg" alt="Add to Cart Icon" class="add-to-cart-icon" style="width: 12px; height: 12px;">
          <span class="add-to-cart-text" style="font-size: 10px; font-weight: 700;">Add to Cart</span>
        `;

        // Remove quantity controls if present
        const quantityControls = item.querySelector(".quantity-controls");
        if (quantityControls) quantityControls.remove();
      });
    }

    function updateCartItem(productId, increment = true) {
      const item = cartItems[productId];
      item.quantity += increment ? 1 : -1;

      if (item.quantity === 0) {
        delete cartItems[productId];
      }
      displayCartItems();
    }

    function addToCart(product) {
      if (!cartItems[product.name]) {
        cartItems[product.name] = { ...product, quantity: 1 };
        displayCartItems();
      }
    }

    data.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const imageUrl =
        window.innerWidth >= 1024
          ? product.image.desktop
          : window.innerWidth >= 768
          ? product.image.tablet
          : product.image.mobile;

      const productImage = document.createElement("img");
      productImage.src = imageUrl;
      productImage.alt = product.name;
      productItem.appendChild(productImage);

      const productCategory = document.createElement("p");
      productCategory.classList.add("product-category");
      productCategory.textContent = product.category;
      productItem.appendChild(productCategory);

      const productName = document.createElement("h2");
      productName.classList.add("product-name");
      productName.textContent = product.name;
      productItem.appendChild(productName);

      const productPrice = document.createElement("p");
      productPrice.classList.add("product-price");
      productPrice.textContent = `$${product.price.toFixed(2)}`;
      productItem.appendChild(productPrice);

      const addToCartButton = document.createElement("button");
      addToCartButton.classList.add("add-to-cart");

      // Create the icon
      const icon = document.createElement("img");
      icon.src = "./images/icon-add-to-cart.svg";
      icon.alt = "Add to Cart Icon";
      icon.classList.add("add-to-cart-icon");

      icon.style.width = "12px";
      icon.style.height = "12px";

      // Create a span for the text
      const addToCartText = document.createElement("span");
      addToCartText.classList.add("add-to-cart-text");
      addToCartText.textContent = "Add to cart";

      // Append icon and text span to the button
      addToCartButton.appendChild(icon);
      addToCartButton.appendChild(addToCartText);

      productItem.appendChild(addToCartButton);

      addToCartButton.addEventListener("click", () => {
        if (!cartItems[product.name]) {
          addToCart(product);
          addToCartButton.style.display = "none";

          const quantityControls = document.createElement("div");
          quantityControls.classList.add("quantity-controls");

          const decrementButton = document.createElement("button");
          const decrementIcon = document.createElement("img");
          decrementIcon.src = "./images/icon-decrement-quantity.svg";
          decrementIcon.alt = "Decrement quantity";
          decrementButton.appendChild(decrementIcon);

          // Styling for Decrement Icon Button
          decrementButton.style.width = "16px"; // Slightly larger for better centering
          decrementButton.style.height = "16px";
          decrementButton.style.borderRadius = "50%";
          decrementButton.style.border = "1px solid var(--Rose-100)";
          decrementButton.style.display = "flex";
          decrementButton.style.justifyContent = "center";
          decrementButton.style.alignItems = "center";
          decrementButton.style.padding = "0"; // Ensures no extra padding

          // Styling the Decrement Icon
          decrementIcon.style.width = "10px";
          decrementIcon.style.height = "2px";

          decrementButton.addEventListener("click", () => {
            updateCartItem(product.name, false);
            const currentQuantity = cartItems[product.name]?.quantity;

            if (currentQuantity) {
              quantityDisplay.textContent = currentQuantity;
            } else {
              addToCartButton.style.display = "flex";
              addToCartButton.style.justifyContent = "center";
              addToCartButton.style.alignItems = "center";
              addToCartButton.style.padding = "2px";
              addToCartButton.style.gap = "6px";
              addToCartButton.style.width = "60%";
              addToCartButton.style.border = "1px solid var(--Rose-500)";
              addToCartButton.style.borderRadius = "12px";
              addToCartButton.style.position = "absolute";
              addToCartButton.style.cursor = "pointer";
              addToCartButton.style.bottom = "62px";
              addToCartButton.style.left = "50%";
              addToCartButton.style.transform = "translateX(-50%)";

              addToCartButton.innerHTML = ""; // Clear content to re-add icon and text

              const icon = document.createElement("img");
              icon.src = "./images/icon-add-to-cart.svg";
              icon.alt = "Add to Cart Icon";
              icon.classList.add("add-to-cart-icon");

              icon.style.width = "12px"; // Ensure icon size is reset
              icon.style.height = "12px";

              const addToCartText = document.createElement("span");
              addToCartText.classList.add("add-to-cart-text");
              addToCartText.textContent = "Add to Cart";
              addToCartText.style.fontSize = "10px";
              addToCartText.style.fontWeight = "700";

              addToCartButton.appendChild(icon);
              addToCartButton.appendChild(addToCartText);

              quantityControls.remove();
            }
          });

          const quantityDisplay = document.createElement("span");
          quantityDisplay.classList.add("quantity-display");
          quantityDisplay.textContent = cartItems[product.name].quantity;

          const incrementButton = document.createElement("button");
          const incrementIcon = document.createElement("img");
          incrementIcon.src = "./images/icon-increment-quantity.svg";
          incrementIcon.alt = "Increment quantity";
          incrementButton.appendChild(incrementIcon);

          // Styling for Increment Icon Button
          // Styling the Increment Button
          incrementButton.style.width = "16px"; // Slightly larger for better icon fit
          incrementButton.style.height = "16px";
          incrementButton.style.borderRadius = "50%";
          incrementButton.style.border = "1px solid var(--Rose-100)";
          incrementButton.style.display = "flex";
          incrementButton.style.justifyContent = "center";
          incrementButton.style.alignItems = "";
          incrementButton.style.padding = "0"; // Ensure no extra padding

          // Styling the Increment Icon
          incrementIcon.style.width = "10px";
          incrementIcon.style.height = "10px";
          incrementIcon.style.display = "inline-flex"; // Helps with alignment
          incrementIcon.style.objectFit = "contain"; // Ensure icon fits without stretching

          incrementButton.addEventListener("click", () => {
            updateCartItem(product.name, true);
            quantityDisplay.textContent = cartItems[product.name].quantity;
          });

          quantityControls.appendChild(decrementButton);
          quantityControls.appendChild(quantityDisplay);
          quantityControls.appendChild(incrementButton);
          productItem.appendChild(quantityControls);
        }
      });

      productGrid.appendChild(productItem);
    });

    displayCartItems();
  })
  .catch((error) => console.error("Error fetching products", error));
