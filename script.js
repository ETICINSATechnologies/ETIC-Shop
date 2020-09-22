const stripe = Stripe(STRIPE_PK);

let currentProductIndex = 0;

var swiper;

function buy(product) {
    if (product && product.stripe_price) {
        stripe
            .redirectToCheckout({
                lineItems: [{ price: product.stripe_price, quantity: 1 }],
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


function createProducts() {
    const productTemplate = document.getElementById("product-template");

    PRODUCTS.forEach(product => {
        const createdProduct = productTemplate.cloneNode(true);
        createdProduct.id = "";

        // Set title
        const titleElem = createdProduct.querySelector(".product-name");
        titleElem.innerText = product.name;

        // Set description
        const descriptionElem = createdProduct.querySelector(".product-description");
        descriptionElem.innerText = product.description;

        // Set price
        const priceElem = createdProduct.querySelector(".buy");
        priceElem.innerText = "Acheter pour " + product.price;

        // Set image
        const imageElem = createdProduct.querySelector(".product-image");
        imageElem.src = product.image || "images/logo.png";
        imageElem.alt = product.name;
        imageElem.title = product.name;

        // Set click listener
        priceElem.addEventListener("click", function () { buy(product) });

        productTemplate.parentElement.appendChild(createdProduct);
    });

    productTemplate.remove();

}

function initialise() {

    // Init products
    createProducts();

    // Init Swiper
    swiper = new Swiper('.swiper-container', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

initialise();