const stripe = Stripe(STRIPE_PK);

let currentProductIndex = 0;

function buy() {
    const currentProduct = PRODUCTS[currentProductIndex];

    if (currentProduct && currentProduct.stripe_price) {
        stripe
            .redirectToCheckout({
                lineItems: [{ price: currentProduct.stripe_price, quantity: 1 }],
                successUrl: SITE_URL + "/success.html",
                cancelUrl: SITE_URL + "/cancel.html",
                mode: 'payment',
            })
            .then(function (result) {
                if (result.error) {
                    // If `redirectToCheckout` fails due to a browser or network
                    // error, display the localized error message to your customer.
                    window.alert(result.error.message);
                }
            });
    }

};

function nextProduct() {
    if (currentProductIndex < (PRODUCTS.length - 1)) {
        ++currentProductIndex;
    } else {
        currentProductIndex = 0;
    }
    updateProductPage();
}

function previousProduct() {
    if (currentProductIndex > 0) {
        --currentProductIndex;
    } else {
        currentProductIndex = PRODUCTS.length - 1;
    }
    updateProductPage();
}

function updateProductPage() {
    const currentProduct = PRODUCTS[currentProductIndex];

    if (currentProduct) {
        // Update title
        const titleElem = document.getElementById("product-name");
        titleElem.innerText = currentProduct.name;

        // Update description
        const descriptionElem = document.getElementById("product-description");
        descriptionElem.innerText = currentProduct.description;

        // Update price
        const priceElem = document.getElementById("buy");
        priceElem.innerText = "Acheter pour " + currentProduct.price;

        // Update image
        const imageElem = document.getElementById("product-image");
        imageElem.src = currentProduct.image || "images/logo.png";
        imageElem.alt = currentProduct.name;
        imageElem.title = currentProduct.name;
    }

}

function initialise() {
    // Add event listeners to buttons
    document.getElementById("buy").addEventListener("click", buy);
    document.getElementById("next").addEventListener("click", nextProduct);
    document.getElementById("previous").addEventListener("click", previousProduct);

    // Initialise product
    updateProductPage();
}

initialise();