// ===============================
// ShopEase Authentication
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // REGISTER
    // ===============================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value;

            if (!name || !email || !password) {
                alert("Please fill all fields.");
                return;
            }

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });

                const data = await response.json();

                console.log("Register response:", data);

                if (!response.ok) {
                    alert(data.message || "Registration failed.");
                    return;
                }

                // Save login information
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Registration successful!");

                // Go to homepage
                window.location.href = "/index.html";

            } catch (error) {
                console.error("Registration error:", error);
                alert("Cannot connect to server. Make sure the server is running.");
            }
        });
    }


    // ===============================
    // LOGIN
    // ===============================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                alert("Please enter email and password.");
                return;
            }

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();

                console.log("Login response:", data);

                if (!response.ok) {
                    alert(data.message || "Login failed.");
                    return;
                }

                // Save login information
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Login successful!");

                // Go to homepage
                window.location.href = "/index.html";

            } catch (error) {
                console.error("Login error:", error);
                alert("Cannot connect to server. Make sure the server is running.");
            }
        });
    }

});
