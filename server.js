const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

const JWT_SECRET = "shopease_secret_key_2026";

const DB_PATH = path.join(__dirname, "database.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Database connected.");
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/images",
    express.static(path.join(__dirname, "public", "images"))
);

// --------------------------------------------------
// DATABASE SETUP
// --------------------------------------------------

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT,
            description TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            customer_name TEXT,
            phone TEXT,
            shipping_address TEXT,
            city TEXT,
            total REAL NOT NULL DEFAULT 0,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `);
});

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function authenticate(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "Authorization token required"
        });
    }

    const parts = header.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    try {

        const decoded = jwt.verify(
            parts[1],
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// --------------------------------------------------
// HEALTH
// --------------------------------------------------

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "ShopEase server is running",
        time: new Date().toISOString()
    });
});

// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

app.get("/api/products", (req, res) => {

    const limit = Math.min(
        Number(req.query.limit) || 100,
        1000
    );

    const offset = Math.max(
        Number(req.query.offset) || 0,
        0
    );

    const search = String(
        req.query.search || ""
    ).trim();

    const category = String(
        req.query.category || ""
    ).trim();

    let sql = `
        SELECT *
        FROM products
        WHERE 1 = 1
    `;

    const params = [];

    if (search) {

        sql += `
            AND (
                name LIKE ?
                OR category LIKE ?
                OR description LIKE ?
            )
        `;

        const value = `%${search}%`;

        params.push(value, value, value);
    }

    if (category && category !== "All") {

        sql += ` AND category = ?`;

        params.push(category);
    }

    sql += `
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    db.all(sql, params, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Could not load products"
            });
        }

        res.json(rows);
    });
});

app.get("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    db.get(
        `SELECT * FROM products WHERE id = ?`,
        [id],
        (err, product) => {

            if (err) {

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json(product);
        }
    );
});

// --------------------------------------------------
// CATEGORIES
// --------------------------------------------------

app.get("/api/categories", (req, res) => {

    db.all(
        `
        SELECT DISTINCT category
        FROM products
        WHERE category IS NOT NULL
        AND category != ''
        ORDER BY category
        `,
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    message: "Could not load categories"
                });
            }

            res.json(
                rows.map(row => row.category)
            );
        }
    );
});

// --------------------------------------------------
// REGISTER
// --------------------------------------------------

app.post("/api/register", async (req, res) => {

    try {

        const name = String(
            req.body.name || ""
        ).trim();

        const email = String(
            req.body.email || ""
        ).trim().toLowerCase();

        const password = String(
            req.body.password || ""
        );

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        db.run(
            `
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword
            ],
            function (err) {

                if (err) {

                    if (
                        err.message.includes("UNIQUE")
                    ) {

                        return res.status(409).json({
                            message: "Email already registered"
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                const token = jwt.sign(
                    {
                        id: this.lastID,
                        name,
                        email
                    },
                    JWT_SECRET,
                    {
                        expiresIn: "7d"
                    }
                );

                res.status(201).json({
                    message: "Registration successful",
                    token,
                    user: {
                        id: this.lastID,
                        name,
                        email
                    }
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

app.get("/api/orders", (req, res) => {

    const queryUserId = Number(req.query.userId);

    let tokenUserId = null;

    const authHeader = req.headers.authorization || "";

    if (authHeader.startsWith("Bearer ")) {

        const token = authHeader.substring(7);

        try {

            const decoded = jwt.verify(
                token,
                JWT_SECRET
            );

            tokenUserId = Number(decoded.id);

        }
        catch(error) {

            console.log("Invalid or expired token");

        }

    }

    const userId =
        tokenUserId ||
        queryUserId;

    if (!userId) {

        return res.status(400).json({
            message: "User ID required"
        });

    }

    db.all(
        `
        SELECT
            id,
            user_id,
            customer_name,
            phone,
            shipping_address,
            city,
            total,
            status,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [userId],
        (err, orders) => {

            if (err) {

                console.error(
                    "Orders database error:",
                    err
                );

                return res.status(500).json({
                    message: "Could not load orders"
                });

            }

            res.json({
                success: true,
                orders: orders
            });

        }
    );

});

// --------------------------------------------------
// CURRENT USER
// --------------------------------------------------

app.get("/api/me", authenticate, (req, res) => {

    db.get(
        `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        `,
        [req.user.id],
        (err, user) => {

            if (err) {

                return res.status(500).json({
                    message: "Could not load account"
                });
            }

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json(user);
        }
    );
});

// --------------------------------------------------
// CREATE ORDER
// --------------------------------------------------

app.post("/api/orders", (req, res) => {
    let tokenUserId = null;

const authHeader = req.headers.authorization || "";

if(authHeader.startsWith("Bearer ")){

    const token = authHeader.substring(7);

    try{

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        tokenUserId = Number(decoded.id);

    }
    catch(error){

        console.log(
            "Invalid or expired token"
        );

    }

}

const userId =
    tokenUserId ||
    Number(req.body.userId) ||
    null;
    if (
        !customerName ||
        !phone ||
        !address ||
        !city ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return res.status(400).json({
            message: "Please provide complete order details"
        });
    }

    const cleanItems = items
        .map(item => ({
            product_id: Number(
                item.productId ?? item.product_id
            ),
            quantity: Math.max(
                1,
                Number(item.quantity) || 1
            )
        }))
        .filter(item => item.product_id > 0);

    if (cleanItems.length === 0) {

        return res.status(400).json({
            message: "Cart is empty"
        });
    }

    const productIds =
        cleanItems.map(item => item.product_id);

    const placeholders =
        productIds.map(() => "?").join(",");

    db.all(
        `
        SELECT id, name, price
        FROM products
        WHERE id IN (${placeholders})
        `,
        productIds,
        (err, productsFound) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Could not verify products"
                });
            }

            if (
                productsFound.length !==
                productIds.length
            ) {

                return res.status(400).json({
                    message: "One or more products no longer exist"
                });
            }

            let total = 0;

            const productMap = {};

            productsFound.forEach(product => {

                productMap[product.id] = product;
            });

            cleanItems.forEach(item => {

                const product =
                    productMap[item.product_id];

                total +=
                    Number(product.price) *
                    item.quantity;
            });

            db.run(
                `
                INSERT INTO orders
                (
                    user_id,
                    customer_name,
                    phone,
                    shipping_address,
                    city,
                    total,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    userId || null,
                    customerName,
                    phone,
                    address,
                    city,
                    total,
                    "Pending"
                ],
                function (orderError) {

                    if (orderError) {

                        console.error(orderError);

                        return res.status(500).json({
                            message: "Could not create order"
                        });
                    }

                    const orderId = this.lastID;

                    const stmt =
                        db.prepare(`
                            INSERT INTO order_items
                            (
                                order_id,
                                product_id,
                                quantity,
                                price
                            )
                            VALUES (?, ?, ?, ?)
                        `);

                    let completed = 0;
                    let failed = false;

                    cleanItems.forEach(item => {

                        const product =
                            productMap[item.product_id];

                        stmt.run(
                            [
                                orderId,
                                item.product_id,
                                item.quantity,
                                product.price
                            ],
                            err => {

                                if (failed) {
                                    return;
                                }

                                if (err) {

                                    failed = true;

                                    stmt.finalize();

                                    return res.status(500).json({
                                        message:
                                            "Could not save order items"
                                    });
                                }

                                completed++;

                                if (
                                    completed ===
                                    cleanItems.length
                                ) {

                                    stmt.finalize();

                                    res.status(201).json({
                                        message:
                                            "Order placed successfully",
                                        orderId,
                                        total
                                    });
                                }
                            }
                        );
                    });
                }
            );
        }
    );
});

// --------------------------------------------------
// GET ORDERS
// --------------------------------------------------

app.get("/api/orders", (req, res) => {

    let userId = null;

    // Get user ID from JWT
    const authHeader = req.headers.authorization || "";

    if (authHeader.startsWith("Bearer ")) {

        const token = authHeader.substring(7);

        try {

            const decoded = jwt.verify(
                token,
                JWT_SECRET
            );

            userId = Number(decoded.id);

        } catch (error) {

            console.log("Invalid or expired token");
        }
    }

    // Fallback to query parameter
    if (!userId) {

        userId = Number(
            req.query.userId
        );
    }

    if (!userId) {

        return res.status(400).json({
            message: "User ID required"
        });

    }

    db.all(
        `
        SELECT
            id,
            user_id,
            total,
            status,
            created_at,
            address,
            payment_method,
            shipping_address
        FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [userId],
        (err, orders) => {

            if (err) {

                console.error(
                    "GET /api/orders error:",
                    err
                );

                return res.status(500).json({
                    message: "Could not load orders",
                    error: err.message
                });

            }

            return res.json({
                success: true,
                orders: orders || []
            });

        }
    );

});
// --------------------------------------------------
// ROOT
// --------------------------------------------------

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {

    console.log("");
    console.log("======================================");
    console.log("       SHOPEASE E-COMMERCE STORE");
    console.log("======================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(
        `Products: http://localhost:${PORT}/api/products`
    );
    console.log(
        `Health: http://localhost:${PORT}/api/health`
    );
    console.log("======================================");
    console.log("");

    db.get(
        `SELECT COUNT(*) AS count FROM products`,
        [],
        (err, result) => {

            if (!err && result) {

                console.log(
                    `Products available: ${result.count}`
                );
            }
        }
    );
});