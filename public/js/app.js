const API = "/api";

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

const productsPerPage = 24;

const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

const pageInfo = document.getElementById("pageInfo");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

const productTotal = document.getElementById("productTotal");


// =====================================================
// PRODUCT IMAGES
// =====================================================

const productImages = {

    "Wireless Headphones":
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",

    "Smart Watch":
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",

    "Bluetooth Speaker":
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",

    "Gaming Mouse":
        "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85",

    "Mechanical Keyboard":
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",

    "Webcam":
        "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=900&q=85",

    "Power Bank":
        "https://images.unsplash.com/photo-1609592424801-9c9c3d5f1d5a?auto=format&fit=crop&w=900&q=85",

    "Wireless Charger":
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85",

    "Earbuds":
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85",

    "Classic Hoodie":
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",

    "Cotton T-Shirt":
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",

    "Denim Jacket":
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=85",

    "Running Shoes":
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",

    "Casual Sneakers":
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",

    "Backpack":
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",

    "Sunglasses":
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",

    "Desk Lamp":
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",

    "Coffee Mug":
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",

    "Gaming Controller":
        "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=85",

    "Gaming Headset":
        "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=85",

    "Football":
        "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=85",

    "Yoga Mat":
        "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=85",

    "Water Bottle":
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",

    "Laptop Stand":
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",

    "Laptop Bag":
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",

    "Phone Case":
        "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85",

    "Fast Charger":
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85",

    "Notebook":
        "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85"
};


// =====================================================
// HELPERS
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getBaseName(name) {

    return name
        .replace(/\s+(Premium|Classic|Pro|Plus)$/i, "")
        .replace(
            /^(Electronics|Fashion|Accessories|Home|Gaming|Beauty|Sports|Books|Mobile & Tablets|Computer & Laptop|Kitchen|Travel|Office Supplies|Automotive|Toys)\s+/i,
            ""
        )
        .trim();
}


function getProductImage(product) {

    const baseName =
        getBaseName(product.name);

    return (
        productImages[baseName] ||
        product.image ||
        `https://picsum.photos/seed/product-${product.id}/800/600`
    );
}


// =====================================================
// CART
// =====================================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

    } catch {

        return [];
    }
}


function updateCartCount() {

    const element =
        document.getElementById("cartCount");

    if (!element) return;

    const count =
        getCart().reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    element.textContent = count;
}


function addToCartById(id) {

    const product =
        allProducts.find(
            item => Number(item.id) === Number(id)
        );

    if (!product) return;

    const cart = getCart();

    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            category: product.category,

            image: getProductImage(product),

            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showToast("Added to cart ✓");
}


// =====================================================
// WISHLIST
// =====================================================

function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem("wishlist") || "[]"
        );

    } catch {

        return [];
    }
}


function isWishlisted(id) {

    return getWishlist()
        .some(
            item =>
                Number(item) === Number(id)
        );
}


function toggleWishlist(id) {

    let wishlist =
        getWishlist();

    if (isWishlisted(id)) {

        wishlist =
            wishlist.filter(
                item =>
                    Number(item) !== Number(id)
            );

    } else {

        wishlist.push(id);
    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    renderProducts();
}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    const old =
        document.querySelector(".toast");

    if (old) old.remove();

    const toast =
        document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 20);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(
            () => toast.remove(),
            300
        );

    }, 2000);
}


// =====================================================
// PRODUCT CARD
// =====================================================

function createProductCard(product) {

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

    const wished =
        isWishlisted(product.id);

    return `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${image}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.src='https://picsum.photos/seed/fallback-${product.id}/800/600'"
                >

                <span class="discount">
                    ${discount}% OFF
                </span>

                <button
                    class="wishlist-btn ${wished ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                >
                    ${wished ? "♥" : "♡"}
                </button>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="rating">
                    ★ ${rating}
                    <small>
                        (${20 + product.id % 80})
                    </small>
                </div>

                <p>
                    ${escapeHTML(
                        product.description
                            .slice(0, 80)
                    )}...
                </p>

                <div class="product-bottom">

                    <div class="price-box">

                        <strong>
                            ₹${Number(product.price)
                                .toLocaleString("en-IN")}
                        </strong>

                        <del>
                            ₹${oldPrice
                                .toLocaleString("en-IN")}
                        </del>

                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCartById(${product.id})"
                    >
                        Add
                    </button>

                </div>

                <a
                    href="product.html?id=${product.id}"
                    class="view-product"
                >
                    View Details →
                </a>

            </div>

        </article>
    `;
}


// =====================================================
// RENDER
// =====================================================

function renderProducts() {

    if (!productGrid) return;

    const total =
        filteredProducts.length;

    productTotal.textContent =
        `${total} product${total === 1 ? "" : "s"}`;

    if (!total) {

        productGrid.innerHTML = "";

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");

    const start =
        (currentPage - 1) *
        productsPerPage;

    const end =
        start + productsPerPage;

    const pageProducts =
        filteredProducts.slice(
            start,
            end
        );

    productGrid.innerHTML =
        pageProducts
            .map(createProductCard)
            .join("");

    const totalPages =
        Math.ceil(
            total / productsPerPage
        );

    pageInfo.textContent =
        `Page ${currentPage} of ${totalPages}`;

    prevPage.disabled =
        currentPage <= 1;

    nextPage.disabled =
        currentPage >= totalPages;
}


// =====================================================
// FILTER
// =====================================================

function applyFilters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const category =
        categoryFilter.value;

    filteredProducts =
        allProducts.filter(product => {

            const searchable =
                (
                    product.name +
                    " " +
                    product.category +
                    " " +
                    product.description
                ).toLowerCase();

            const matchesSearch =
                !search ||
                searchable.includes(search);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    const sort =
        sortSelect.value;

    if (sort === "low") {

        filteredProducts.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    } else if (sort === "high") {

        filteredProducts.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    } else if (sort === "name") {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }

    currentPage = 1;

    renderProducts();
}


// =====================================================
// CATEGORIES
// =====================================================

function loadCategories() {

    fetch(`${API}/categories`)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Category API failed"
                );
            }

            return response.json();
        })
        .then(categories => {

            categoryFilter.innerHTML =
                `<option value="all">
                    All Categories
                </option>`;

            categories.forEach(category => {

                const option =
                    document.createElement("option");

                option.value =
                    category.category;

                option.textContent =
                    category.category;

                categoryFilter.appendChild(
                    option
                );
            });

            const chips =
                document.getElementById(
                    "categoryChips"
                );

            if (!chips) return;

            chips.innerHTML = "";

            const allButton =
                document.createElement("button");

            allButton.className =
                "chip active";

            allButton.textContent =
                "All";

            allButton.dataset.category =
                "all";

            chips.appendChild(allButton);

            categories
                .slice(0, 8)
                .forEach(category => {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.className =
                        "chip";

                    button.textContent =
                        category.category;

                    button.dataset.category =
                        category.category;

                    chips.appendChild(
                        button
                    );
                });

            chips
                .querySelectorAll(".chip")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        function () {

                            chips
                                .querySelectorAll(".chip")
                                .forEach(chip =>
                                    chip.classList
                                        .remove("active")
                                );

                            this.classList
                                .add("active");

                            categoryFilter.value =
                                this.dataset.category;

                            applyFilters();
                        }
                    );
                });

        })
        .catch(error => {

            console.error(
                "Category error:",
                error
            );
        });
}


// =====================================================
// PRODUCTS
// =====================================================

function loadProducts() {

    loading.classList.remove(
        "hidden"
    );

    fetch(
        `${API}/products?limit=1000`
    )
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Product API failed"
                );
            }

            return response.json();
        })
        .then(products => {

            console.log(
                "Products loaded:",
                products.length
            );

            allProducts =
                products;

            filteredProducts =
                [...products];

            loading.classList.add(
                "hidden"
            );

            renderProducts();
        })
        .catch(error => {

            console.error(
                "Product loading error:",
                error
            );

            loading.classList.add(
                "hidden"
            );

            productGrid.innerHTML = `

                <div class="error-box">

                    <h3>
                        Products could not be loaded
                    </h3>

                    <p>
                        Check that the ShopEase
                        server is running.
                    </p>

                    <button
                        onclick="loadProducts()"
                    >
                        Try Again
                    </button>

                </div>
            `;
        });
}


// =====================================================
// RESET
// =====================================================

function resetFilters() {

    searchInput.value = "";

    categoryFilter.value =
        "all";

    sortSelect.value =
        "default";

    currentPage = 1;

    applyFilters();
}


// =====================================================
// EVENTS
// =====================================================

searchInput?.addEventListener(
    "input",
    applyFilters
);

categoryFilter?.addEventListener(
    "change",
    applyFilters
);

sortSelect?.addEventListener(
    "change",
    applyFilters
);

prevPage?.addEventListener(
    "click",
    function () {

        if (currentPage > 1) {

            currentPage--;

            renderProducts();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
);

nextPage?.addEventListener(
    "click",
    function () {

        const totalPages =
            Math.ceil(
                filteredProducts.length /
                productsPerPage
            );

        if (currentPage < totalPages) {

            currentPage++;

            renderProducts();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
);


// =====================================================
// START
// =====================================================

updateCartCount();
loadCategories();
loadProducts();