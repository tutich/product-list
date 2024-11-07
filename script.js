fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const productGrid = document.getElementById("product-grid");
    const cartContainer = document.querySelector(".cart");
    const modalContainer = document.createElement("div"); // Create modal container
    modalContainer.classList.add("modal");
    document.body.appendChild(modalContainer); // Append to body
    let cartItems = {}; // Object to store cart items with quantity

    // Function to display cart items
    function displayCartItems() {
      cartContainer.innerHTML = `
        <p>Your Cart</p>
        ${
          Object.keys(cartItems).length === 0
            ? '<img src="./images/illustration-empty-cart.svg" alt="empty"><p>Your added items will appear here</p>'
            : Object.values(cartItems)
                .map(
                  (item) => `
              <div class="cart-item">
                <p>${item.name}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `
                )
                .join("")
        }
      `;

      // Check if there are items in the cart and add a Confirm Order button
      if (Object.keys(cartItems).length > 0) {
        const confirmOrderButton = document.createElement("button");
        confirmOrderButton.classList.add("confirm-order");
        confirmOrderButton.textContent = "Confirm Order";

        // Add event listener for confirming order
        confirmOrderButton.addEventListener("click", () => {
          displayModal(); // Show the modal
        });

        // Append Confirm Order button to cart container
        cartContainer.appendChild(confirmOrderButton);
      }
    }

    // Display Modal on Confirm Order Click
    function displayModal() {
      modalContainer.innerHTML = `
        <div class="modal-content">
          <h2>Order Confirmed</h2>
          <p>Thank you for your purchase! Here is your order:</p>
          <ul>
            ${Object.values(cartItems)
              .map(
                (item) => `
              <li>${item.name} - Quantity: ${item.quantity} - Total: $${(
                  item.price * item.quantity
                ).toFixed(2)}</li>
            `
              )
              .join("")}
          </ul>
          <button id="newOrderButton">Start New Order</button>
        </div>
      `;
      modalContainer.style.display = "flex"; // Show modal (display flex for centering)

      // Handle Start New Order button click
      document
        .getElementById("newOrderButton")
        .addEventListener("click", () => {
          cartItems = {}; // Clear cart items
          modalContainer.style.display = "none"; // Hide modal
          displayCartItems(); // Refresh cart display
          resetProductGrid(); // Reset the product grid UI
        });
    }

    // Reset product grid to show "Add to Cart" buttons and remove quantity controls
    function resetProductGrid() {
      document.querySelectorAll(".product-item").forEach((item) => {
        // Show "Add to Cart" button
        const addToCartButton = item.querySelector(".add-to-cart");
        addToCartButton.style.display = "block";

        // Remove quantity controls
        const quantityControls = item.querySelector(".quantity-controls");
        if (quantityControls) {
          quantityControls.remove();
        }
      });
    }

    // Function to update the quantity of a product in the cart
    function updateCartItem(productId, increment = true) {
      const item = cartItems[productId];

      if (increment) {
        item.quantity += 1;
      } else {
        item.quantity -= 1;
        if (item.quantity === 0) {
          delete cartItems[productId];
        }
      }
      displayCartItems();
    }

    // Function to add product to cart with initial quantity
    function addToCart(product) {
      if (!cartItems[product.name]) {
        cartItems[product.name] = { ...product, quantity: 1 };
        displayCartItems();
      }
    }

    // Create product elements for each item
    data.forEach((product) => {
      // Product container
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const imageUrl =
        window.innerWidth >= 1024
          ? product.image.desktop
          : window.innerWidth >= 768
          ? product.image.tablet
          : product.image.mobile;

      // Product image
      const productImage = document.createElement("img");
      productImage.src = imageUrl;
      productImage.alt = product.name;
      productItem.appendChild(productImage);

      // Product category
      const productCategory = document.createElement("p");
      productCategory.classList.add("product-category");
      productCategory.textContent = product.category;
      productItem.appendChild(productCategory);

      // Product name
      const productName = document.createElement("h2");
      productName.classList.add("product-name");
      productName.textContent = product.name;
      productItem.appendChild(productName);


      // Product price
      const productPrice = document.createElement("p");
      productPrice.classList.add("product-price");
      productPrice.textContent = `$${product.price.toFixed(2)}`;
      productItem.appendChild(productPrice);

      // Add to Cart button and quantity controls
      const addToCartButton = document.createElement("button");
      addToCartButton.classList.add("add-to-cart");
      addToCartButton.textContent = "Add to Cart";
      productItem.appendChild(addToCartButton);

      // Add event listener for adding product to cart
      addToCartButton.addEventListener("click", () => {
        if (!cartItems[product.name]) {
          addToCart(product);
          addToCartButton.style.display = "none"; // Hide the button

          // Create quantity controls
          const quantityControls = document.createElement("div");
          quantityControls.classList.add("quantity-controls");

          // Decrement button with icon
          const decrementButton = document.createElement("button");
          const decrementIcon = document.createElement("img");
          decrementIcon.src = "./images/icon-decrement-quantity.svg";
          decrementIcon.alt = "Decrement quantity";
          decrementButton.appendChild(decrementIcon);
          decrementButton.addEventListener("click", () => {
            updateCartItem(product.name, false);
            const currentQuantity = cartItems[product.name]?.quantity;
            if (currentQuantity) {
              quantityDisplay.textContent = currentQuantity;
            } else {
              addToCartButton.style.display = "block";
              addToCartButton.textContent = "Add to Cart";
              quantityControls.remove();
            }
          });

          // Quantity display
          const quantityDisplay = document.createElement("span");
          quantityDisplay.classList.add("quantity-display");
          quantityDisplay.textContent = cartItems[product.name].quantity;

          // Increment button with icon
          const incrementButton = document.createElement("button");
          const incrementIcon = document.createElement("img");
          incrementIcon.src = "./images/icon-increment-quantity.svg";
          incrementIcon.alt = "Increment quantity";
          incrementButton.appendChild(incrementIcon);
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

      // Append product item to the grid
      productGrid.appendChild(productItem);
    });

    displayCartItems(); // Initialize empty cart display
  })
  .catch((error) => console.error("Error fetching products", error));
