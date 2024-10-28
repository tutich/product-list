
  fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const productGrid = document.getElementById('product-grid');

    const cartContainer = document.querySelector('.cart');
    const cartItems = [];

    // Display cart items
    function displayCartItems() {
        cartContainer.innerHTML = `
        <p>Your Cart</> 
        ${cartItems.length === 0 ? '<img src="./images/illustration-empty-cart.svg" alt="empty"><p>Your added items will appear here</p>'
            : cartItems.map(item => `
                <div class="cart-item">
                <p>${item.name}</p>
                <p>$${item.price.toFixed(2)}</p>
              </div>
                `).join('')
        }
        `;
    }

    // To add products to cart
    function addCart (product) {
        cartItems.push(product);
        displayCartItems();
    }

    data.forEach(product => {
        // create item container
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        // Get appropriate image sizes
        const imageUrl = window.innerWidth >= 1024 ? product.image.desktop : window.innerWidth >= 768 ? product.image.tablet : product.image.mobile;

        // Add product Image
        const productImage = document.createElement('img');
        productImage.src = imageUrl;
        productImage.alt = product.name;
        productItem.appendChild(productImage);

        // Add prodduct name
        const productName = document.createElement('h2');
        productName.classList.add('product-name');
        productName.textContent = product.name;
        productItem.appendChild(productName);

        // Add product Category
        const productCategory = document.createElement('p');
        productCategory.classList.add('product-category');
        productCategory.textContent = product.category;
        productItem.appendChild(productCategory);

        // Add product price
        const productPrice = document.createElement('p');
        productPrice.classList.add('product-price');
        productPrice.textContent = `$${product.price.toFixed(2)}`;
        productItem.appendChild(productPrice);

        // add to cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addCart(product));
        productItem.appendChild(addToCartButton);

        // append product-item to product grid
        productGrid.appendChild(productItem);

    });
  })
  .catch( error = console.error('Error fetching products', error));