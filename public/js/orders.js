const ordersContainer =
    document.getElementById("ordersContainer");

const token =
    localStorage.getItem("token");


// ========================================
// LOGIN CHECK
// ========================================

if (!token) {

    alert("Please login to view your orders.");

    window.location.href = "login.html";
}


// ========================================
// LOAD ORDERS
// ========================================

async function loadOrders() {

    try {

        const response =
            await fetch(
                "/api/orders",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.href =
                    "login.html";

                return;
            }

            throw new Error(
                data.message ||
                "Unable to load orders"
            );
        }


        displayOrders(data);

    } catch (error) {

        console.error(
            "Orders error:",
            error
        );

        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load orders
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(orders) {

    if (!orders || orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <div class="empty-icon">
                    📦
                </div>

                <h2>
                    No orders yet
                </h2>

                <p>
                    You haven't placed an order yet.
                </p>

                <a
                    href="index.html"
                    class="order-shop-btn"
                >
                    Start Shopping →
                </a>

            </div>
        `;

        return;
    }


    ordersContainer.innerHTML =
        orders.map(function (order) {

            const date =
                new Date(
                    order.created_at
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            return `
                <div class="order-card">

                    <div class="order-top">

                        <div>

                            <span class="order-label">
                                ORDER
                            </span>

                            <h2>
                                #${order.id}
                            </h2>

                        </div>


                        <span class="order-status">
                            ${escapeHTML(order.status)}
                        </span>

                    </div>


                    <div class="order-info">

                        <div>
                            <small>
                                Order Date
                            </small>

                            <strong>
                                ${date}
                            </strong>
                        </div>


                        <div>
                            <small>
                                Payment
                            </small>

                            <strong>
                                ${escapeHTML(
                                    order.payment_method
                                )}
                            </strong>
                        </div>


                        <div>
                            <small>
                                Total
                            </small>

                            <strong>
                                ₹${Number(
                                    order.total
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>

                    </div>


                    <div class="order-bottom">

                        <span>
                            ${escapeHTML(
                                order.customer_name
                            )}
                        </span>

                        <button
                            onclick="viewOrder(${order.id})"
                        >
                            View Order →
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// ========================================
// VIEW ORDER
// ========================================

function viewOrder(id) {

    window.location.href =
        `order-success.html?id=${id}`;
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href =
        "index.html";
}


// ========================================
// CART COUNT
// ========================================

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
        document.getElementById(
            "cartCount"
        );


    if (element) {
        element.textContent = count;
    }
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

updateCartCount();
loadOrders();
