console.log("login.js loaded ✅");

// Dynamic API Base URL detection
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  (window.location.port === '5500' || window.location.port === '3000' || window.location.port === '5173' || window.location.port === '8080')
  ? 'http://localhost:5000'
  : '';

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 without this, page reloads

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.innerText = data.message;
      return;
    }

 // ✅ SUCCESS
localStorage.setItem("eatwise_logged_in", "true"); // 🔑 REQUIRED
localStorage.setItem("eatwiseEmail", email);

if (data.profileCompleted) {
  window.location.href = "dashboard.html";
} else {
  window.location.href = "details.html";
}

    

  } catch (err) {
    console.error(err);
    errorBox.innerText = "Server error. Try again.";
  }
});
