const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = "shopease_secret_2026";

// Create orders table
function createOrdersTable(db) {
    db.run(
        "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, city TEXT NOT NULL, pincode TEXT NOT NULL, payment_method TEXT NOT NULL, total REAL NOT NULL, status TEXT DEFAULT 'Placed', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        function (err) {
            if (err) {
                console.log("Orders table error:", err.message);
            } else {
                console.log("Orders table ready.");
            }
        }
    );

    db.run(
        "CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, product_name TEXT NOT NULL, price REAL NOT NULL, quantity INTEGER NOT NULL)",
        function (err) {
            if (err) {
                console.log("Order items table error:", err.message);
            } else {
                console.log("Order items table ready.");
            }
        }
    );
}

// Authentication middleware
function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Login required"
        });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// Create order
router.post("/", authenticate, function (req, res) {

    const db = req.app.locals.db;

    const {
        customer,
        paymentMethod,
        total,
        items
    } = req.body;

    if (!customer || !paymentMethod || !items || !items.length) {
        return res.status(400).json({
            message: "Incomplete order information"
        });
    }

    if (
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.city ||
        !customer.pincode
    ) {
        return res.status(400).json({
            message: "Please complete delivery details"
        });
    }

    const orderTotal = Number(total);

    if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
        return res.status(400).json({
            message: "Invalid order total"
        });
    }

    db.run(
        "INSERT INTO orders (user_id, customer_name, phone, address, city, pincode, payment_method, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.user.id,
            customer.name,
            customer.phone,
            customer.address,
            customer.city,
            customer.pincode,
            paymentMethod,
            orderTotal,
            "Placed"
        ],
        function (err) {

            if (err) {
                console.log("Order insert error:", err.message);

                return res.status(500).json({
                    message: "Failed to create order"
                });
            }

            const orderId = this.lastID;

            const sql =
                "INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)";

            let completed = 0;
            let failed = false;

            items.forEach(function (item) {

                db.run(
                    sql,
                    [
                        orderId,
                        item.id,
                        item.name,
                        Number(item.price),
                        Number(item.quantity)
                    ],
                    function (itemError) {

                        if (failed) return;

                        if (itemError) {
                            failed = true;

                            console.log(
                                "Order item error:",
                                itemError.message
                            );

                            return res.status(500).json({
                                message: "Failed to save order items"
                            });
                        }

                        completed++;

                        if (completed === items.length) {

                            res.status(201).json({
                                message: "Order placed successfully",
                                orderId: orderId
                            });
                        }
                    }
                );
            });
        }
    );
});

// Get user's orders
router.get("/", authenticate, function (req, res) {

    const db = req.app.locals.db;

    db.all(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
        [req.user.id],
        function (err, orders) {

            if (err) {
                return res.status(500).json({
                    message: "Failed to load orders"
                });
            }

            res.json(orders);
        }
    );
});

// Get single order
router.get("/:id", authenticate, function (req, res) {

    const db = req.app.locals.db;

    db.get(
        "SELECT * FROM orders WHERE id = ? AND user_id = ?",
        [
            req.params.id,
            req.user.id
        ],
        function (err, order) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            db.all(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.id],
                function (itemError, items) {

                    if (itemError) {
                        return res.status(500).json({
                            message: "Failed to load order items"
                        });
                    }

                    res.json({
                        order: order,
                        items: items
                    });
                }
            );
        }
    );
});

module.exports = {
    router,
    createOrdersTable
};