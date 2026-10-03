/* =========================================================
   LA BELLA RESTAURANT
   MAIN JAVASCRIPT
   Version: 2.1
   Works with:
   Home | Menu | About | Contact
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEYS = {
        cart: "laBellaCart",
        favorites: "laBellaFavorites",
        reservation: "laBellaReservation"
    };

    function getStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            return value !== null
                ? JSON.parse(value)
                : fallback;

        } catch (error) {
            console.error("Storage error:", error);
            return fallback;
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Storage error:", error);
        }
    }


    /* =====================================================
       CART SYSTEM
    ===================================================== */

    let cart = getStorage(STORAGE_KEYS.cart, []);

    if (!Array.isArray(cart)) {
        cart = [];
    }

    const cartCountElements =
        document.querySelectorAll("#cart-count");


    function getCartCount() {
        return cart.reduce(function (total, item) {
            return total + Number(item.quantity || 0);
        }, 0);
    }


    function updateCartCount() {

        const count = getCartCount();

        cartCountElements.forEach(function (element) {
            element.textContent = count;
        });

        setStorage(STORAGE_KEYS.cart, cart);
    }


    function addToCart(product) {

        const existingProduct = cart.find(function (item) {
            return item.id === product.id;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        updateCartCount();

        showNotification(
            product.name + " added to your cart.",
            "success"
        );
    }


    document.querySelectorAll(".add-to-cart")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const card =
                    button.closest(".food-card");

                if (!card) return;


                const titleElement =
                    card.querySelector("h3");


                const priceElement =
                    card.querySelector(
                        "[data-price], .price"
                    );


                const imageElement =
                    card.querySelector("img");


                const name =
                    titleElement
                        ? titleElement.textContent.trim()
                        : "Food Item";


                const price =
                    priceElement
                        ? priceElement.textContent.trim()
                        : "";


                const image =
                    imageElement
                        ? imageElement.getAttribute("src")
                        : "";


                const id =
                    button.dataset.productId ||
                    card.dataset.id ||
                    name
                        .toLowerCase()
                        .replace(/\s+/g, "-");


                addToCart({
                    id: id,
                    name: name,
                    price: price,
                    image: image
                });


                const originalHTML =
                    button.innerHTML;


                button.innerHTML = `
                    <i class="fa-solid fa-check mr-2"></i>
                    Added
                `;


                button.classList.remove(
                    "bg-orange-600",
                    "hover:bg-orange-700"
                );


                button.classList.add(
                    "bg-green-600"
                );


                setTimeout(function () {

                    button.innerHTML =
                        originalHTML;


                    button.classList.remove(
                        "bg-green-600"
                    );


                    button.classList.add(
                        "bg-orange-600",
                        "hover:bg-orange-700"
                    );

                }, 1500);

            });

        });


    updateCartCount();


    /* =====================================================
       CART BUTTON
    ===================================================== */

    const cartButton =
        document.getElementById("cart-button");


    if (cartButton) {

        cartButton.addEventListener("click", function () {

            const count = getCartCount();


            if (count === 0) {

                showNotification(
                    "Your cart is empty.",
                    "info"
                );

                return;
            }


            showCartSummary();

        });
    }


    /* =====================================================
       CART SUMMARY
    ===================================================== */

    function showCartSummary() {

        const count = getCartCount();


        let message =
            "Your La Bella Cart\n\n";


        cart.forEach(function (item) {

            message +=
                item.name +
                " × " +
                item.quantity +
                "\n";

        });


        message +=
            "\nTotal Items: " +
            count;


        alert(message);
    }


    /* =====================================================
       FAVORITES
    ===================================================== */

    let favorites =
        getStorage(
            STORAGE_KEYS.favorites,
            []
        );


    if (!Array.isArray(favorites)) {
        favorites = [];
    }


    function updateFavoriteButton(button) {

        const card =
            button.closest(".food-card");


        const id =
            button.dataset.productId ||
            (card ? card.dataset.id : null);


        if (!id) return;


        const icon =
            button.querySelector("i");


        const isFavorite =
            favorites.includes(id);


        if (isFavorite) {

            if (icon) {

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );
            }


            button.classList.remove(
                "bg-white",
                "text-orange-600"
            );


            button.classList.add(
                "bg-orange-600",
                "text-white"
            );

        } else {

            if (icon) {

                icon.classList.remove(
                    "fa-solid"
                );

                icon.classList.add(
                    "fa-regular"
                );
            }


            button.classList.remove(
                "bg-orange-600",
                "text-white"
            );


            button.classList.add(
                "bg-white",
                "text-orange-600"
            );
        }
    }


    document.querySelectorAll(".favorite-btn")
        .forEach(function (button) {

            const card =
                button.closest(".food-card");


            const id =
                button.dataset.productId ||
                (card ? card.dataset.id : null);


            if (id) {
                button.dataset.productId = id;
            }


            updateFavoriteButton(button);


            button.addEventListener("click", function () {

                const productId =
                    button.dataset.productId;


                if (!productId) return;


                if (favorites.includes(productId)) {

                    favorites =
                        favorites.filter(function (id) {
                            return id !== productId;
                        });


                    showNotification(
                        "Removed from favorites.",
                        "info"
                    );

                } else {

                    favorites.push(productId);


                    showNotification(
                        "Added to favorites.",
                        "success"
                    );
                }


                setStorage(
                    STORAGE_KEYS.favorites,
                    favorites
                );


                updateFavoriteButton(button);

            });

        });


    /* =====================================================
       MENU CATEGORY FILTER
    ===================================================== */

    const categoryButtons =
        document.querySelectorAll(
            ".category-btn"
        );


    const foodCards =
        document.querySelectorAll(
            ".food-card"
        );


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category =
                button.dataset.category ||
                "all";


            categoryButtons.forEach(function (btn) {

                btn.classList.remove(
                    "bg-orange-600",
                    "text-white"
                );


                btn.classList.add(
                    "bg-white",
                    "text-gray-700"
                );

            });


            button.classList.remove(
                "bg-white",
                "text-gray-700"
            );


            button.classList.add(
                "bg-orange-600",
                "text-white"
            );


            foodCards.forEach(function (card) {

                const cardCategory =
                    card.dataset.category;


                const shouldShow =
                    category === "all" ||
                    category === cardCategory;


                card.style.display =
                    shouldShow
                        ? ""
                        : "none";

            });

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchButton =
        document.getElementById(
            "search-button"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                if (foodCards.length === 0) {

                    showNotification(
                        "Search is available on the Menu page.",
                        "info"
                    );

                    return;
                }


                const search =
                    prompt(
                        "Search for a food item:"
                    );


                if (search === null) return;


                const searchText =
                    search.trim().toLowerCase();


                if (!searchText) {

                    foodCards.forEach(function (card) {
                        card.style.display = "";
                    });

                    return;
                }


                let found = false;


                foodCards.forEach(function (card) {

                    const text =
                        card.textContent.toLowerCase();


                    if (text.includes(searchText)) {

                        card.style.display = "";

                        found = true;

                    } else {

                        card.style.display = "none";
                    }

                });


                if (!found) {

                    showNotification(
                        'No food found for "' +
                        search +
                        '".',
                        "error"
                    );


                    foodCards.forEach(function (card) {
                        card.style.display = "";
                    });

                } else {

                    const firstResult =
                        Array.from(foodCards).find(
                            function (card) {
                                return card.style.display !== "none";
                            }
                        );


                    if (firstResult) {

                        firstResult.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }
                }

            }
        );
    }


    /* =====================================================
       RESERVATION FORM
    ===================================================== */

    const reservationForm =
        document.getElementById(
            "reservation-form"
        );


    if (reservationForm) {

        const dateInput =
            document.getElementById("date");


        /* Prevent selecting previous dates */

        if (dateInput) {

            const today =
                new Date();


            const year =
                today.getFullYear();


            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");


            dateInput.min =
                `${year}-${month}-${day}`;
        }


        reservationForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim();


                const date =
                    document
                        .getElementById("date")
                        ?.value;


                const time =
                    document
                        .getElementById("time")
                        ?.value;


                const guests =
                    document
                        .getElementById("guests")
                        ?.value;


                const message =
                    document
                        .getElementById("message")
                        ?.value
                        .trim();


                /* Required fields */

                if (
                    !name ||
                    !email ||
                    !date ||
                    !time ||
                    !guests
                ) {

                    showNotification(
                        "Please complete all required fields.",
                        "error"
                    );

                    return;
                }


                /* Email validation */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showNotification(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                /* Check selected date */

                const selectedDate =
                    new Date(date + "T00:00:00");


                const today =
                    new Date();


                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if (selectedDate < today) {

                    showNotification(
                        "Please select today or a future date.",
                        "error"
                    );

                    return;
                }


                /* Reservation object */

                const reservation = {

                    name: name,

                    email: email,

                    date: date,

                    time: time,

                    guests: guests,

                    message: message,

                    createdAt:
                        new Date().toISOString()
                };


                /* Save reservation */

                setStorage(
                    STORAGE_KEYS.reservation,
                    reservation
                );


                showNotification(
                    "Reservation received successfully!",
                    "success"
                );


                setTimeout(function () {

                    alert(
                        "Thank you, " +
                        name +
                        "!\n\n" +

                        "Your table reservation has been received.\n\n" +

                        "Date: " +
                        date +
                        "\n" +

                        "Time: " +
                        time +
                        "\n" +

                        "Guests: " +
                        guests
                    );


                    reservationForm.reset();

                }, 300);

            }
        );
    }


    /* =====================================================
       FEATURE INFORMATION
    ===================================================== */

    const featureButtons =
        document.querySelectorAll(
            "[data-feature]"
        );


    featureButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const title =
                    button.dataset.title ||
                    "La Bella";


                const description =
                    button.dataset.description ||
                    "Discover more about La Bella Restaurant.";


                showFeature(
                    title,
                    description
                );

            }
        );

    });


    function showFeature(
        title,
        description
    ) {

        const infoBox =
            document.getElementById(
                "feature-info"
            );


        const titleElement =
            document.getElementById(
                "feature-title"
            );


        const descriptionElement =
            document.getElementById(
                "feature-description"
            );


        if (!infoBox) return;


        if (titleElement) {
            titleElement.textContent = title;
        }


        if (descriptionElement) {
            descriptionElement.textContent = description;
        }


        infoBox.classList.remove(
            "hidden"
        );


        infoBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    const closeFeatureButton =
        document.getElementById(
            "close-feature"
        );


    if (closeFeatureButton) {

        closeFeatureButton.addEventListener(
            "click",
            function () {

                const infoBox =
                    document.getElementById(
                        "feature-info"
                    );


                if (infoBox) {

                    infoBox.classList.add(
                        "hidden"
                    );
                }

            }
        );
    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuButton =
        document.getElementById(
            "mobile-menu-button"
        );


    const mobileMenu =
        document.getElementById(
            "mobile-menu"
        );


    if (
        mobileMenuButton &&
        mobileMenu
    ) {

        const icon =
            mobileMenuButton.querySelector("i");


        mobileMenuButton.addEventListener(
            "click",
            function () {

                const isHidden =
                    mobileMenu.classList.toggle(
                        "hidden"
                    );


                if (icon) {

                    if (isHidden) {

                        icon.classList.remove(
                            "fa-xmark"
                        );


                        icon.classList.add(
                            "fa-bars"
                        );

                    } else {

                        icon.classList.remove(
                            "fa-bars"
                        );


                        icon.classList.add(
                            "fa-xmark"
                        );
                    }
                }

            }
        );


        /* Close mobile menu after clicking a link */

        mobileMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu.classList.add(
                            "hidden"
                        );


                        if (icon) {

                            icon.classList.remove(
                                "fa-xmark"
                            );


                            icon.classList.add(
                                "fa-bars"
                            );
                        }

                    }
                );

            });
    }


    /* =====================================================
       SCROLL TO TOP
    ===================================================== */

    const scrollTopButton =
        document.getElementById(
            "scroll-top"
        );


    if (scrollTopButton) {

        function updateScrollButton() {

            if (window.scrollY > 400) {

                scrollTopButton.classList.remove(
                    "hidden"
                );

            } else {

                scrollTopButton.classList.add(
                    "hidden"
                );
            }
        }


        window.addEventListener(
            "scroll",
            updateScrollButton
        );


        updateScrollButton();


        scrollTopButton.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (
        !currentPage ||
        currentPage === ""
    ) {

        currentPage =
            "index.html";
    }


    document
        .querySelectorAll("nav a[href]")
        .forEach(function (link) {

            const href =
                link.getAttribute("href");


            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {
                return;
            }


            const linkPage =
                href.split("#")[0];


            if (linkPage === currentPage) {

                link.classList.add(
                    "text-orange-600",
                    "font-semibold"
                );


                link.classList.remove(
                    "text-gray-700"
                );
            }

        });


    /* =====================================================
       EMAIL LINKS
    ===================================================== */

    document
        .querySelectorAll("[data-email]")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    const email =
                        link.dataset.email;


                    if (email) {

                        window.location.href =
                            "mailto:" + email;
                    }

                }
            );

        });


    /* =====================================================
       PHONE LINKS
    ===================================================== */

    document
        .querySelectorAll("[data-phone]")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    const phone =
                        link.dataset.phone;


                    if (phone) {

                        window.location.href =
                            "tel:" + phone;
                    }

                }
            );

        });


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    document
        .querySelectorAll(".current-year")
        .forEach(function (element) {

            element.textContent =
                new Date().getFullYear();

        });


    /* =====================================================
       NOTIFICATION SYSTEM
    ===================================================== */

    function showNotification(
        message,
        type = "info"
    ) {

        const oldNotification =
            document.getElementById(
                "la-bella-notification"
            );


        if (oldNotification) {
            oldNotification.remove();
        }


        const notification =
            document.createElement("div");


        notification.id =
            "la-bella-notification";


        let icon =
            "fa-circle-info";


        if (type === "success") {

            icon =
                "fa-circle-check";

        } else if (type === "error") {

            icon =
                "fa-circle-exclamation";
        }


        notification.className = `
            fixed
            top-24
            right-5
            z-[9999]
            max-w-sm
            bg-white
            text-gray-800
            shadow-2xl
            rounded-2xl
            px-5
            py-4
            flex
            items-center
            gap-3
            border
            border-gray-100
            translate-x-[120%]
            transition-transform
            duration-300
        `;


        notification.innerHTML = `
            <i class="fa-solid ${icon}
                      text-orange-600
                      text-xl"></i>

            <p class="font-medium">
                ${escapeHTML(message)}
            </p>
        `;


        document.body.appendChild(
            notification
        );


        requestAnimationFrame(function () {

            notification.classList.remove(
                "translate-x-[120%]"
            );

        });


        setTimeout(function () {

            notification.classList.add(
                "translate-x-[120%]"
            );


            setTimeout(function () {

                if (notification) {
                    notification.remove();
                }

            }, 300);

        }, 3000);

    }


    /* =====================================================
       SECURITY HELPER
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       GLOBAL ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (mobileMenu) {

                    mobileMenu.classList.add(
                        "hidden"
                    );
                }
            }

        }
    );


    /* =====================================================
       APPLICATION READY
    ===================================================== */

    console.log(
        "La Bella Restaurant JavaScript initialized successfully."
    );

});