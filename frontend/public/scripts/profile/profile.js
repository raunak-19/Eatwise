console.log("profile.js loaded ✅");

// API Base: localhost in dev, Render in production
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://eatwise-572k.onrender.com';

const email = localStorage.getItem("eatwiseEmail");

if (!email) {
  alert("Session expired. Please login again.");
  window.location.href = "../login.html";
}

fetch(`${API_BASE}/get-profile`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email })
})
  .then(res => res.json())
  .then(data => {
    document.getElementById("pName").innerText = data.name || "--";
    document.getElementById("pAge").innerText = data.age || "--";
    document.getElementById("pDiseases").innerText =
      (data.diseases && data.diseases.length > 0) ? data.diseases.join(", ") : "None";
  });
