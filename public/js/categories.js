const categoryGrid =
    document.getElementById("categoryGrid");

async function loadCategories() {

    try {

        const response =
            await fetch("/api/categories");

        const categories =
            await response.json();

        categoryGrid.innerHTML =
            categories.map(function (category) {

                return `
                    <div
                        class="category-card"
                        onclick="openCategory('${escapeHTML(category.category)}')"
                    >

                        <div class="category-icon">
                            ${getIcon(category.category)}
                        </div>

                        <h2>
                            ${escapeHTML(category.category)}
                        </h2>

                        <p>
                            ${category.count} products
                        </p>

                        <span>
                            Explore →
                        </span>

                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error(error);

        categoryGrid.innerHTML = `
            <div class="loading">
                Unable to load categories.
            </div>
        `;
    }
}


function openCategory(category) {

    window.location.href =
        "index.html?category=" +
        encodeURIComponent(category);
}


function getIcon(category) {

    const icons = {

        Electronics: "📱",

        Fashion: "👕",

        Accessories: "👜",

        Home: "🏠",

        Gaming: "🎮",

        Beauty: "✨",

        Sports: "🏃",

        Books: "📚",

        "Mobile & Tablets": "📲",

        "Computer & Laptop": "💻",

        Kitchen: "🍳",

        Travel: "✈️",

        "Office Supplies": "📒",

        Automotive: "🚗",

        Toys: "🧸"
    };

    return icons[category] || "🛍️";
}


function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const count =
        cart.reduce(
            function (total, item) {
                return total +
                    Number(item.quantity || 0);
            },
            0
        );

    const element =
        document.getElementById("cartCount");

    if (element) {
        element.textContent = count;
    }
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


updateCartCount();
loadCategories();