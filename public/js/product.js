const API = "/api";

const container =
    document.getElementById("productDetails");

const params =
    new URLSearchParams(window.location.search);

const productId =
    Number(params.get("id"));

let product = null;
let quantity = 1;

const productImages = {

    "Wireless Headphones":
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",

    "Smart Watch":
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",

    "Gaming Mouse":
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=85",

    "Mechanical Keyboard":
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",

    "Bluetooth Speaker":
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85",

    "Running Shoes":
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",

    "Cotton T-Shirt":
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",

    "Classic Hoodie":
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",

    "Backpack":
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",

    "Sunglasses":
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85",

    "Desk Lamp":
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",

    "Coffee Mug":
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85",

    "Gaming Controller":
        "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1000&q=85",

    "Gaming Headset":
        "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1000&q=85",

    "Yoga Mat":
        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1000&q=85",

    "Water Bottle":
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85"
};

function getBaseName(name) {

    return name
        .replace(/\s+(Premium|Classic|Pro|Plus)$/i, "")
        .replace(
            /^(Electronics|Fashion|Accessories|Home|Gaming|Beauty|Sports|Books|Mobile & Tablets|Computer & Laptop|Kitchen|Travel|Office Supplies|Automotive|Toys)\s+/i,
            ""
        )
        .trim();
}

function getProductImage(item) {

    const base =
        getBaseName(item.name);

    return (
        productImages[base] ||
        item.image ||
        `https://picsum.photos/seed/product-${item.id}/1000/800`
    );
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

    const count =
        cart.reduce(
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

function renderProduct() {

    const image =
        getProductImage(product);

    const discount =
        10 + (product.id % 30);

    const oldPrice =
        Math.round(
            product.price /
            (1 - discount / 100)
        );

    const rating =
        (4 + ((product.id % 10) / 10))
            .toFixed(1);

    container.innerHTML = `

        <div class="product-detail-image">

            <span class="detail-discount">
                ${discount}% OFF
            </span>

            <img
                src="${image}"
                alt="${escapeHTML(product.name)}"
                onerror="this.src='https://picsum.photos/seed/product-${product.id}/1000/800'"
            >

        </div>

        <div class="product-detail-info">

            <span class="product-category">
                ${escapeHTML(product.category)}
            </span>

            <h1>
                ${escapeHTML(product.name)}
            </h1>

            <div class="detail-rating">
                ★ ${rating}
                <span>
                    ${20 + product.id % 80} reviews
                </span>
            </div>

            <div class="detail-price-row">

                <strong class="detail-price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </strong>

                <del class="detail-old-price">
                    ₹${oldPrice.toLocaleString("en-IN")}
                </del>

                <span class="detail-save">
                    Save ${discount}%
                </span>

            </div>

            <p class="detail-description">
                ${escapeHTML(product.description)}
            </p>

            <div class="product-features">

                <div>
                    <span>✓</span>
                    Premium quality
                </div>

                <div>
                    <span>✓</span>
                    Fast delivery
                </div>

                <div>
                    <span>✓</span>
                    Easy returns
                </div>

                <div>
                    <span>✓</span>
                    Secure payment
                </div>

            </div>

            <div class="quantity-section">

                <label>Quantity</label>

                <div class="quantity-control">

                    <button onclick="changeQuantity(-1)">
                        −
                    </button>

                    <span id="quantity">
                        1
                    </span>

                    <button onclick="changeQuantity(1)">
                        +
                    </button>

                </div>

            </div>

            <div class="detail-actions">

                <button
                    class="add-cart-btn"
                    onclick="addToCart()"
                >
                    🛒 Add to Cart
                </button>

                <button
                    class="buy-btn"
                    onclick="buyNow()"
                >
                    Buy Now
                </button>

            </div>

        </div>
    `;
}

function changeQuantity(amount) {

    quantity =
        Math.max(
            1,
            quantity + amount
        );

    document.getElementById(
        "quantity"
    ).textContent = quantity;
}

function addToCart() {

    let cart =
        JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity) +
            quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            category: product.category,

            image: getProductImage(product),

            quantity: quantity
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showMessage(
        "Product added to cart ✓"
    );
}

function buyNow() {

    addToCart();

    setTimeout(() => {

        window.location.href =
            "cart.html";

    }, 400);
}

function showMessage(message) {

    const existing =
        document.querySelector(".toast");

    if (existing) {
        existing.remove();
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(
            () => toast.remove(),
            300
        );

    }, 2000);
}

function loadProduct() {

    if (!productId) {

        container.innerHTML = `
            <div class="error-box">
                <h2>Product not found</h2>
                <a href="index.html">
                    Back to Shop
                </a>
            </div>
        `;

        return;
    }

    fetch(`${API}/products/${productId}`)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Product not found"
                );
            }

            return response.json();
        })
        .then(data => {

            product = data;

            renderProduct();
        })
        .catch(error => {

            console.error(error);

            container.innerHTML = `
                <div class="error-box">
                    <h2>Unable to load product</h2>
                    <p>Please try again.</p>
                    <a href="index.html">
                        Back to Products
                    </a>
                </div>
            `;
        });
}

updateCartCount();
loadProduct();
