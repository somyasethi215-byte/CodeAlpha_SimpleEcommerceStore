const cartContent =
    document.getElementById("cartContent");

function getCart() {

    try {
        return JSON.parse(
            localStorage.getItem("cart") || "[]"
        );
    } catch {
        return [];
    }
}

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}

function updateCartCount() {

    const count =
        getCart().reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

    const element =
        document.getElementById("cartCount");

    if (element) {
        element.textContent = count;
    }
}

function formatPrice(value) {

    return Number(value)
        .toLocaleString("en-IN");
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function changeQuantity(index, amount) {

    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity =
        Number(cart[index].quantity) +
        amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();
}

function clearCart() {

    if (!confirm(
        "Are you sure you want to clear your cart?"
    )) {
        return;
    }

    localStorage.removeItem("cart");

    updateCartCount();

    renderCart();
}

function renderCart() {

    const cart = getCart();

    if (!cart.length) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added
                    anything to your cart yet.
                </p>

                <a
                    href="index.html"
                    class="primary-btn"
                >
                    Start Shopping →
                </a>

            </div>
        `;

        return;
    }

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

    });

    const shipping =
        subtotal >= 999 ? 0 : 79;

    const total =
        subtotal + shipping;

    cartContent.innerHTML = `

        <div class="cart-layout">

            <section class="cart-items">

                <div class="cart-header-row">

                    <strong>
                        ${cart.length}
                        item${cart.length > 1 ? "s" : ""}
                    </strong>

                    <button
                        onclick="clearCart()"
                        class="clear-cart"
                    >
                        Clear Cart
                    </button>

                </div>

                ${cart.map((item, index) => `

                    <article class="cart-item">

                        <a href="product.html?id=${item.id}">

                            <img
                                src="${item.image}"
                                alt="${escapeHTML(item.name)}"
                                onerror="this.src='https://picsum.photos/seed/cart-${item.id}/300/300'"
                            >

                        </a>

                        <div class="cart-item-info">

                            <span>
                                ${escapeHTML(item.category || "Product")}
                            </span>

                            <h3>
                                ${escapeHTML(item.name)}
                            </h3>

                            <strong>
                                ₹${formatPrice(item.price)}
                            </strong>

                            <div class="cart-controls">

                                <div class="quantity-control">

                                    <button
                                        onclick="changeQuantity(${index}, -1)"
                                    >
                                        −
                                    </button>

                                    <b>
                                        ${item.quantity}
                                    </b>

                                    <button
                                        onclick="changeQuantity(${index}, 1)"
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    class="remove-btn"
                                    onclick="removeItem(${index})"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                        <div class="cart-item-total">
                            ₹${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}
                        </div>

                    </article>

                `).join("")}

            </section>

            <aside class="cart-summary">

                <h2>Order Summary</h2>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>
                        ₹${formatPrice(subtotal)}
                    </strong>
                </div>

                <div class="summary-row">
                    <span>Delivery</span>
                    <strong>
                        ${shipping === 0
                            ? "FREE"
                            : "₹" + formatPrice(shipping)}
                    </strong>
                </div>

                <div class="free-delivery">
                    ${
                        subtotal >= 999
                            ? "✓ Free delivery applied"
                            : "Add ₹" +
                              formatPrice(999 - subtotal) +
                              " more for free delivery"
                    }
                </div>

                <hr>

                <div class="summary-total">
                    <span>Total</span>
                    <strong>
                        ₹${formatPrice(total)}
                    </strong>
                </div>

                <button
                    class="checkout-btn"
                    onclick="goToCheckout()"
                >
                    Proceed to Checkout →
                </button>

                <a
                    href="index.html"
                    class="continue-shopping"
                >
                    ← Continue Shopping
                </a>

            </aside>

        </div>
    `;
}

function goToCheckout() {

    if (!getCart().length) {
        return;
    }

    window.location.href =
        "checkout.html";
}

updateCartCount();
renderCart();