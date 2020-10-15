const stripe = Stripe(STRIPE_PK);

var swiper;
let currentProductIndex = 0;
let shoppingBasket = {};

function buyBasket() {
    const lineItems = [];
    let countItems = 0;

    for (const itemId in shoppingBasket) {
        const item = shoppingBasket[itemId];
        if (item.count > 0) {
            lineItems.push({
                price: item.product.stripe_price,
                quantity: item.count
            });
        }
        countItems += item.count;
    }

    if (countItems > 0) {
        stripe
            .redirectToCheckout({
                lineItems: lineItems,
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
    } else {
        window.alert("Veuillez ajouter des produits dans le panier avant de passer la commande.")
    }
};

function addToBasket(product) {
    if (product && product.stripe_price) {
        shoppingBasket[product.id]["count"] += 1;
        const totalPrice = Object.values(shoppingBasket).reduce(function (acc, curr) {
            return acc + (curr["count"] * curr["product"]["price"]);
        }, 0);
        const basketCounter = document.getElementById("basket-counter");
        basketCounter.innerText = totalPrice.toFixed(2) + "€";
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
        const priceElem = createdProduct.querySelector(".add-to-basket");
        priceElem.innerText = "Ajouter au panier : " + product.price.toFixed(2) + "€";

        // Set image
        const imageElem = createdProduct.querySelector(".product-image");
        imageElem.src = product.image || "images/logo.png";
        imageElem.alt = product.name;
        imageElem.title = product.name;

        // Set click listener
        priceElem.addEventListener("click", function () { addToBasket(product) });

        productTemplate.parentElement.appendChild(createdProduct);

        // Add item to basket
        shoppingBasket[product.id] = { product: product, count: 0 };
    });

    // Set click listener for basket checkout
    const basketCheckout = document.getElementById("basket-container");
    basketCheckout.addEventListener("click", buyBasket);

    productTemplate.remove();
}

function initialise() {
    // Init products
    createProducts();

    // Init Swiper
    swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

initialise();