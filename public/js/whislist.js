const wishlistGrid =
    document.getElementById("wishlistGrid");

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

async function loadWishlist() {

    if (wishlist.length === 0) {
        showEmpty();
        return;
    }

    try {

        const response =
            await fetch("/api/products");

        const products =
            await response.json();

        const wishlistProducts =
            products.filter(product =>
                wishlist.includes(product.id)
            );

        if (wishlistProducts.length === 0) {
            showEmpty();
            return;
        }

        wishlistGrid.innerHTML =
            wishlistProducts.map(product => `

                <div class="wishlist-card">

                    <img
                        src="${escapeHTML(
                            product.image ||
                            "https://via.placeholder.com/400"
                        )}"
                        onclick="openProduct(${product.id})"
                        alt="${escapeHTML(product.name)}"
                    >

                    <div class="wishlist-content">

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                product.category || "General"
                            )}
                        </p>

                        <div class="wishlist-price">
                            ₹${Number(product.price)
                                .toLocaleString("en-IN")}
                        </div>

                        <div class="wishlist-actions">

                            <button
                                class="wishlist-cart"
                                onclick="addToCart(${product.id})"
                            >
                                🛒 Add to Cart
                            </button>

                            <button
                                class="wishlist-remove"
                                onclick="removeWishlist(${product.id})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            `).join("");

    } catch (error) {

        console.error(error);

        wishlistGrid.innerHTML =
            "<p>Unable to load wishlist.</p>";
    }
}

function addToCart(id) {

    fetch("/api/products")
        .then(response => response.json())
        .then(products => {

            const product =
                products.find(item => item.id === id);

            if (!product) return;

            const existing =
                cart.find(item => item.id === id);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            alert("Product added to cart.");

        });
}

function removeWishlist(id) {

    wishlist =
        wishlist.filter(
            productId => productId !== id
        );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    loadWishlist();
}

function openProduct(id) {
    window.location.href =
        `product.html?id=${id}`;
}

function showEmpty() {

    wishlistGrid.innerHTML = `
        <div class="wishlist-empty">

            <h2>Your wishlist is empty ❤️</h2>

            <p>
                Save products here and come back later.
            </p>

            <br>

            <a href="index.html">
                Continue Shopping
            </a>

        </div>
    `;
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

loadWishlist();