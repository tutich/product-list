
  fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const productGrid = document.getElementById('product-grid');

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

        // append product-item to product grid
        productGrid.appendChild(productItem);
    });
  })
  .catch( error = console.error('Error fetching products', error));