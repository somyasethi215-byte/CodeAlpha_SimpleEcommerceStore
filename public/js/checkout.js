const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const token =
    localStorage.getItem("token");

let selectedPayment = "COD";

let subtotal = 0;
let discount = 0;

const checkoutItems =
    document.getElementById("checkoutItems");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const totalElement =
    document.getElementById("checkoutTotal");

const errorBox =
    document.getElementById("checkoutError");

const payButton =
    document.getElementById("payButton");


// ========================================
// INITIAL CHECK
// ========================================

if (!token) {

    alert("Please login before checkout.");

    window.location.href = "login.html";
}

if (!cart.length) {

    alert("Your cart is empty.");

    window.location.href = "index.html";
}


// ========================================
// DISPLAY CART
// ========================================

function showSummary() {

    subtotal = 0;

    checkoutItems.innerHTML =
        cart.map(function (item) {

            const quantity =
                Number(item.quantity) || 1;

            const price =
                Number(item.price) || 0;

            const itemTotal =
                price * quantity;

            subtotal += itemTotal;

            return `
                <div class="summary-item">

                    <img
                        src="${escapeHTML(
                            item.image ||
                            "https://via.placeholder.com/100"
                        )}"
                        alt="${escapeHTML(item.name)}"
                    >

                    <div class="summary-item-info">

                        <div class="summary-item-name">
                            ${escapeHTML(item.name)}
                        </div>

                        <div class="summary-item-qty">
                            Qty: ${quantity}
                        </div>

                    </div>

                    <div class="summary-item-price">
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </div>

                </div>
            `;

        }).join("");

    updateTotal();
}


// ========================================
// PAYMENT SELECTION
// ========================================

function selectPayment(method, element) {

    selectedPayment = method;

    document
        .querySelectorAll(".payment-option")
        .forEach(function (option) {

            option.classList.remove("selected");

        });

    element.classList.add("selected");


    document
        .querySelectorAll('input[name="payment"]')
        .forEach(function (radio) {

            radio.checked =
                radio.value === method;

        });


    document
        .querySelectorAll(".payment-panel")
        .forEach(function (panel) {

            panel.classList.remove("active");

        });


    if (method === "COD") {

        document
            .getElementById("codPanel")
            .classList.add("active");

        payButton.textContent =
            "Place COD Order";

    }


    if (method === "UPI") {

        document
            .getElementById("upiPanel")
            .classList.add("active");

        payButton.textContent =
            "Pay with UPI";

    }


    if (method === "Card") {

        document
            .getElementById("cardPanel")
            .classList.add("active");

        payButton.textContent =
            "Pay with Card";

    }
}


// ========================================
// COUPON
// ========================================

function applyCoupon() {

    const input =
        document.getElementById("couponInput");

    const message =
        document.getElementById("couponMessage");

    const code =
        input.value
            .trim()
            .toUpperCase();

    discount = 0;


    if (code === "WELCOME10") {

        discount =
            Math.round(subtotal * 0.10);

        message.textContent =
            "✓ 10% discount applied.";

        message.style.color =
            "#15803d";

    }

    else if (code === "SHOP100") {

        discount =
            Math.min(100, subtotal);

        message.textContent =
            "✓ ₹100 discount applied.";

        message.style.color =
            "#15803d";

    }

    else if (code === "FREESHIP") {

        discount = 0;

        message.textContent =
            "✓ Free delivery applied.";

        message.style.color =
            "#15803d";

    }

    else {

        message.textContent =
            "Invalid coupon code.";

        message.style.color =
            "#dc2626";
    }

    updateTotal();
}


// ========================================
// TOTAL
// ========================================

function updateTotal() {

    const total =
        Math.max(
            0,
            subtotal - discount
        );


    subtotalElement.textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;


    discountElement.textContent =
        `-₹${discount.toLocaleString("en-IN")}`;


    totalElement.textContent =
        `₹${total.toLocaleString("en-IN")}`;
}


// ========================================
// CUSTOMER DETAILS
// ========================================

function getCustomer() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();

    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();

    const address =
        document
            .getElementById("customerAddress")
            .value
            .trim();

    const city =
        document
            .getElementById("customerCity")
            .value
            .trim();

    const pincode =
        document
            .getElementById("customerPincode")
            .value
            .trim();


    if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !pincode
    ) {

        showError(
            "Please complete all delivery details."
        );

        return null;
    }


    if (!/^\d{10}$/.test(phone)) {

        showError(
            "Enter a valid 10-digit phone number."
        );

        return null;
    }


    if (!/^\d{6}$/.test(pincode)) {

        showError(
            "Enter a valid 6-digit pincode."
        );

        return null;
    }


    return {
        name: name,
        phone: phone,
        address: address,
        city: city,
        pincode: pincode
    };
}


// ========================================
// PROCESS PAYMENT
// ========================================

async function processPayment() {

    const customer =
        getCustomer();

    if (!customer) return;


    // CARD DEMO VALIDATION

    if (selectedPayment === "Card") {

        const card =
            document
                .getElementById("demoCard")
                .value
                .trim();

        const expiry =
            document
                .getElementById("demoExpiry")
                .value
                .trim();

        const cvv =
            document
                .getElementById("demoCVV")
                .value
                .trim();


        if (!card || !expiry || !cvv) {

            showError(
                "Enter the demo card details first."
            );

            return;
        }
    }


    payButton.disabled = true;

    payButton.textContent =
        "Processing...";


    // COD creates the order immediately.

    if (selectedPayment === "COD") {

        await createOrder(customer);

        return;
    }


    // UPI / CARD are demo payments.

    await new Promise(function (resolve) {

        setTimeout(resolve, 1200);

    });


    document
        .getElementById("paymentSuccess")
        .classList.add("show");
}


// ========================================
// FINISH PAYMENT
// ========================================

async function createOrder(customer) {

    try {

        if (!token) {

            showError(
                "Please login before placing an order."
            );

            payButton.disabled = false;
            payButton.textContent = "Try Again";

            return;
        }


        if (!cart.length) {

            showError(
                "Your cart is empty."
            );

            payButton.disabled = false;

            return;
        }


        // Convert cart items to backend format

        const items = cart.map(function (item) {

            return {
                productId: Number(
                    item.productId ||
                    item.product_id ||
                    item.id
                ),

                quantity: Math.max(
                    1,
                    Number(item.quantity) || 1
                )
            };

        });


        // Check product IDs

        const invalidItem = items.some(function (item) {

            return !item.productId;

        });


        if (invalidItem) {

            showError(
                "One or more cart products are invalid. Please remove the item and add it again."
            );

            payButton.disabled = false;
            payButton.textContent = "Try Again";

            return;
        }


        /*
        Backend expects:

        userId
        customerName
        phone
        address
        city
        items
        */

        const orderData = {

            userId: getUserId(),

            customerName:
                customer.name,

            phone:
                customer.phone,

            address:
                customer.address,

            city:
                customer.city,

            items:
                items

        };


        console.log(
            "SENDING ORDER:",
            orderData
        );


        const response =
            await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );


        const data =
            await response.json();


        console.log(
            "ORDER RESPONSE:",
            data
        );


        if (!response.ok) {

            showError(
                data.message ||
                "Unable to create order."
            );

            payButton.disabled = false;

            payButton.textContent =
                "Try Again";

            return;
        }


        // Order successfully created

        localStorage.removeItem("cart");

        localStorage.removeItem(
            "shopease_cart"
        );


        const orderId =
            data.orderId ||
            data.order_id ||
            data.id;


        // Redirect to confirmation page

        if (orderId) {

            window.location.href =
                `order-confirmation.html?id=${orderId}`;

        }
        else {

            window.location.href =
                "order-confirmation.html";

        }

    }

    catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );

        showError(
            "Server connection failed. Make sure npm start is running."
        );

        payButton.disabled = false;

        payButton.textContent =
            "Try Again";
    }
}

// ========================================
// CREATE ORDER
// ========================================

async function createOrder(customer) {

    try {

        if (!token) {

            showError(
                "Please login before placing an order."
            );

            payButton.disabled = false;

            payButton.textContent =
                "Try Again";

            return;
        }


        if (!cart.length) {

            showError(
                "Your cart is empty."
            );

            payButton.disabled = false;

            return;
        }


        /*
        IMPORTANT

        The backend expects:
        product_id
        quantity
        total
        shipping_address
        */

        const total =
            Math.max(
                0,
                subtotal - discount
            );


        /*
        Convert the cart into the format
        expected by the backend.
        */

        const orderItems =
            cart.map(function (item) {

                return {
                    product_id:
                        Number(
                            item.product_id ||
                            item.productId ||
                            item.id
                        ),

                    quantity:
                        Number(item.quantity) || 1
                };

            });


        // Validate product IDs.

        const invalidItem =
            orderItems.some(function (item) {

                return !item.product_id;

            });


        if (invalidItem) {

            showError(
                "One or more cart products are invalid. Please remove the item and add it again."
            );

            payButton.disabled = false;

            payButton.textContent =
                "Try Again";

            return;
        }


        /*
        Shipping address is sent as one
        complete string.
        */

        const shippingAddress =
            `${customer.name}, ${customer.phone}, ${customer.address}, ${customer.city} - ${customer.pincode}`;


        /*
        Send the format expected by
        the Express backend.
        */

        const orderData = {

            items: orderItems,

            total: total,

            shipping_address:
                shippingAddress,

            payment_method:
                selectedPayment

        };


        console.log(
            "SENDING ORDER:",
            orderData
        );


        const response =
            await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );


        const data =
            await response.json();


        console.log(
            "ORDER RESPONSE:",
            data
        );


        if (!response.ok) {

            showError(
                data.message ||
                "Unable to create order."
            );

            payButton.disabled =
                false;

            payButton.textContent =
                "Try Again";

            return;
        }


        /*
        Order created successfully.
        */

        localStorage.removeItem("cart");

        /*
        Keep compatibility with the
        newer ShopEase frontend.
        */

        localStorage.removeItem("shopease_cart");


        const orderId =
            data.orderId ||
            data.order_id ||
            data.id;


        /*
        Redirect to the existing
        success page.
        */

        if (orderId) {

            window.location.href =
                `order-confirmation.html?id=${orderId}`;

        }
        else {

            window.location.href =
                "order-confirmation.html";

        }

    }

    catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );


        showError(
            "Server connection failed. Make sure npm start is running."
        );


        payButton.disabled =
            false;

        payButton.textContent =
            "Try Again";
    }
}


// ========================================
// ERROR
// ========================================

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// START
// ========================================

showSummary();