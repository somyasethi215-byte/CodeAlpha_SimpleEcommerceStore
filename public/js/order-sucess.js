const token =
    localStorage.getItem("token");

const params =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    params.get("id");

const container =
    document.getElementById(
        "orderDetails"
    );

async function loadOrder() {

    if (!token || !orderId) {

        container.innerHTML = `
            <p>
                Order information unavailable.
            </p>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                `/api/orders/${orderId}`,
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

            container.innerHTML = `
                <p>
                    ${escapeHTML(
                        data.message ||
                        "Order not found."
                    )}
                </p>
            `;

            return;
        }

        const order =
            data.order;

        const items =
            data.items || [];

        container.innerHTML = `

            <div class="order-row">
                <strong>Order ID</strong>
                <span>#${order.id}</span>
            </div>

            <div class="order-row">
                <strong>Status</strong>
                <span>${escapeHTML(order.status)}</span>
            </div>

            <div class="order-row">
                <strong>Payment</strong>
                <span>
                    ${escapeHTML(
                        order.payment_method
                    )}
                </span>
            </div>

            <div class="order-row">
                <strong>Customer</strong>
                <span>
                    ${escapeHTML(
                        order.customer_name
                    )}
                </span>
            </div>

            <div class="order-row">
                <strong>Delivery</strong>
                <span>
                    ${escapeHTML(order.city)}
                    -
                    ${escapeHTML(order.pincode)}
                </span>
            </div>

            <h3>
                Items
            </h3>

            ${items.map(item => `

                <div class="order-row">

                    <span>
                        ${escapeHTML(
                            item.product_name
                        )}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ₹${(
                            Number(item.price) *
                            Number(item.quantity)
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>

            `).join("")}

            <div class="order-row">

                <strong>
                    Total
                </strong>

                <strong>
                    ₹${Number(order.total)
                        .toLocaleString("en-IN")}
                </strong>

            </div>
        `;

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load order details.
            </p>
        `;
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

loadOrder();
