fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const productGrid = document.getElementById("product-grid");

    const cartContainer = document.querySelector(".cart");
    const cartItems = {};

    // Display cart items
    function displayCartItems() {
      cartContainer.innerHTML = `
        <p>Your Cart</> 
        ${
          Object.keys(cartItems).length === 0
            ? '<img src="./images/illustration-empty-cart.svg" alt="empty"><p>Your added items will appear here</p>'
            : Object.values(cartItems)
                .map(
                  (item) => `
                <div class="cart-item">
                <p>Quantity: ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
              </div>
                `
                )
                .join("")
        }
        `;
    }

    // Function to update the quantity of a product in the cart
    function updateCartItem(productId, increment = true) {
      const item = cartItems[productId];

      if (increment) {
        item.quantity += 1;
      } else {
        item.quantity -= 1;
        if (item.quantity === 0) delete cartItems[productId];
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
    data.forEach((product) => {
      // create item container
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      // Get appropriate image sizes
      const imageUrl =
        window.innerWidth >= 1024
          ? product.image.desktop
          : window.innerWidth >= 768
          ? product.image.tablet
          : product.image.mobile;

      // Add product Image
      const productImage = document.createElement("img");
      productImage.src = imageUrl;
      productImage.alt = product.name;
      productItem.appendChild(productImage);

      // Add prodduct name
      const productName = document.createElement("h2");
      productName.classList.add("product-name");
      productName.textContent = product.name;
      productItem.appendChild(productName);

      // Add product Category
      const productCategory = document.createElement("p");
      productCategory.classList.add("product-category");
      productCategory.textContent = product.category;
      productItem.appendChild(productCategory);

      // Add product price
      const productPrice = document.createElement("p");
      productPrice.classList.add("product-price");
      productPrice.textContent = `$${product.price.toFixed(2)}`;
      productItem.appendChild(productPrice);

      // add to cart button
      const addToCartButton = document.createElement("button");
      addToCartButton.classList.add("add-to-cart");
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.addEventListener("click", () => addCart(product));
      productItem.appendChild(addToCartButton);

      addToCartButton.addEventListener("click", () => {
        if (!cartItems[product.name]) {
          addToCart(product);
      
          // Clear and reset the button content for the quantity controls
          addToCartButton.innerHTML = ""; 
      
          // Create a wrapper to hold quantity and control buttons
          const quantityWrapper = document.createElement("div");
          quantityWrapper.classList.add("quantity-wrapper");
      
          // Decrement button with icon
          const decrementButton = document.createElement("button");
          const decrementIcon = document.createElement("img");
          decrementIcon.src = "./images/icon-decrement-quantity.svg";
          decrementIcon.alt = "Decrement quantity";
          decrementButton.appendChild(decrementIcon);
          decrementButton.addEventListener("click", () => {
            if (cartItems[product.name].quantity > 1) {
              updateCartItem(product.name, false);
              quantityDisplay.textContent = cartItems[product.name].quantity;
            } else {
              updateCartItem(product.name, false);
              addToCartButton.textContent = "Add to Cart";
              quantityWrapper.remove();
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
      
          // Append controls and quantity display to the wrapper
          quantityWrapper.appendChild(decrementButton);
          quantityWrapper.appendChild(quantityDisplay);
          quantityWrapper.appendChild(incrementButton);
      
          // Append wrapper to addToCartButton
          addToCartButton.appendChild(quantityWrapper);
        }
      });
      

      // append product-item to product grid
      productGrid.appendChild(productItem);
    });
    displayCartItems();
  })
  .catch((error = console.error("Error fetching products", error)));
