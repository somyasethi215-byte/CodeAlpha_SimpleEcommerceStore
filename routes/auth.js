const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = "shopease_secret_2026";


// ========================================
// REGISTER
// ========================================

router.post("/register", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    const db = req.app.locals.db;

    if (!db) {
        return res.status(500).json({
            message: "Database connection error"
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.get(
        "SELECT id FROM users WHERE email = ?",
        [cleanEmail],
        async (err, existingUser) => {

            if (err) {
                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            try {

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );

                const sql =
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

                db.run(
                    sql,
                    [
                        name.trim(),
                        cleanEmail,
                        hashedPassword
                    ],
                    function (err) {

                        if (err) {

                            console.error(
                                "Insert error:",
                                err
                            );

                            return res.status(500).json({
                                message: "Registration failed"
                            });
                        }

                        const token =
                            jwt.sign(
                                {
                                    id: this.lastID,
                                    email: cleanEmail
                                },
                                JWT_SECRET,
                                {
                                    expiresIn: "7d"
                                }
                            );

                        res.status(201).json({

                            message:
                                "Registration successful",

                            token: token,

                            user: {
                                id: this.lastID,
                                name: name.trim(),
                                email: cleanEmail
                            }

                        });

                    }
                );

            } catch (error) {

                console.error(
                    "Password hashing error:",
                    error
                );

                res.status(500).json({
                    message: "Server error"
                });
            }
        }
    );
});


// ========================================
// LOGIN
// ========================================

router.post("/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const db = req.app.locals.db;

    if (!db) {
        return res.status(500).json({
            message: "Database connection error"
        });
    }

    const cleanEmail =
        email.trim().toLowerCase();

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [cleanEmail],
        async (err, user) => {

            if (err) {

                console.error(
                    "Database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!user) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });
            }

            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatch) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });
                }

                const token =
                    jwt.sign(
                        {
                            id: user.id,
                            email: user.email
                        },
                        JWT_SECRET,
                        {
                            expiresIn: "7d"
                        }
                    );

                res.json({

                    message:
                        "Login successful",

                    token: token,

                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }

                });

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                res.status(500).json({
                    message: "Login failed"
                });
            }
        }
    );
});


module.exports = router;
