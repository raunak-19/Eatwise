document.addEventListener("DOMContentLoaded", () => {
    // API Base: localhost in dev, Render in production
    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : 'https://eatwise-572k.onrender.com';

    // Only run if we are on the dashboard and profile elements exist
    const profileForm = document.getElementById("profileForm");
    if (!profileForm) return;

    /* ----------------------------------------------------
       ✅ LOAD PROFILE DATA
    ---------------------------------------------------- */
    loadProfile();

    async function loadProfile() {
        const email = localStorage.getItem("eatwiseEmail");
        if (!email) return;

        // Show loading state if needed, or just wait consistently
        try {
            const res = await fetch(`${API_BASE}/get-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                const data = await res.json();

                // Populate fields
                if (data.name) document.getElementById("profileName").value = data.name;
                if (data.age) document.getElementById("profileAge").value = data.age;
                if (data.gender) document.getElementById("profileGender").value = data.gender.toLowerCase();

                // Diseases is an array based on our schema, but input is text. Join it.
                if (data.diseases && Array.isArray(data.diseases)) {
                    document.getElementById("profileDiseases").value = data.diseases.join(", ");
                } else if (data.diseases) {
                    document.getElementById("profileDiseases").value = data.diseases;
                }

                // Handle Height & Weight
                let height = data.height;
                let weight = data.weight;

                // Fallback to local storage if server data is missing (e.g. before server restart)
                if (!height || !weight) {
                    const localProfile = JSON.parse(localStorage.getItem("eatwiseProfile") || "{}");
                    if (!height) height = localProfile.height;
                    if (!weight) weight = localProfile.weight;
                }

                if (height) {
                    document.getElementById("profileHeight").value = height;
                }
                if (weight) {
                    document.getElementById("profileWeight").value = weight;
                }

                // Calculate BMI if data exists
                if (height && weight) {
                    updateBMIDisplay(height, weight);
                }

                // ✅ Save to local storage for other scripts (discover.js)
                localStorage.setItem("eatwiseProfile", JSON.stringify(data));

                console.log("Profile loaded successfully");
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
        }
    }

    /* ----------------------------------------------------
       💾 SAVE PROFILE DATA
    ---------------------------------------------------- */
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = localStorage.getItem("eatwiseEmail");
        const name = document.getElementById("profileName").value.trim();
        const age = parseInt(document.getElementById("profileAge").value);
        const gender = document.getElementById("profileGender").value;
        const height = parseFloat(document.getElementById("profileHeight").value) || 0;
        const weight = parseFloat(document.getElementById("profileWeight").value) || 0;
        const diseasesStr = document.getElementById("profileDiseases").value.trim();

        // Convert diseases string to array
        const diseases = diseasesStr
            ? diseasesStr.split(",").map(d => d.trim()).filter(d => d)
            : [];

        const saveBtn = document.querySelector(".save-profile-btn");
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = "Submitting...";
        saveBtn.disabled = true;

        const msgDiv = document.getElementById("profileSaveMessage");
        msgDiv.style.display = "none";
        msgDiv.className = "profile-message";

        try {
            const res = await fetch(`${API_BASE}/save-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, age, gender, height, weight, diseases })
            });

            const data = await res.json();

            if (res.ok) {
                // Success
                msgDiv.textContent = "✅ Profile saved successfully!";
                msgDiv.className = "profile-message success";
                msgDiv.style.display = "block";

                // Update local storage
                const currentProfile = JSON.parse(localStorage.getItem("eatwiseProfile") || "{}");
                localStorage.setItem("eatwiseProfile", JSON.stringify({ ...currentProfile, diseases, height, weight }));

                // Recalculate BMI immediately
                updateBMIDisplay(height, weight);

            } else {
                throw new Error(data.message || "Save failed");
            }
        } catch (err) {
            console.error(err);
            msgDiv.textContent = "❌ Failed to save profile. Try again.";
            msgDiv.className = "profile-message error";
            msgDiv.style.display = "block";
        } finally {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    });

    /* ----------------------------------------------------
       🧠 BMI LOGIC (Added Feature)
    ---------------------------------------------------- */
    function updateBMIDisplay(h, w) {
        if (!h || !w || h <= 0 || w <= 0) {
            document.getElementById("bmiContainer").style.display = "none";
            return;
        }

        // BMI = kg / (m^2)
        const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);

        const valEl = document.getElementById("bmiValue");
        const catText = document.getElementById("bmiCategoryText");
        const descEl = document.getElementById("bmiDescription");
        const container = document.getElementById("bmiContainer");

        container.style.display = "flex";
        valEl.textContent = bmi;

        // Determine Category
        let category = "";
        let className = "";
        let desc = "";

        if (bmi < 18.5) {
            category = "Underweight";
            className = "bmi-underweight";
            desc = "Your BMI is below average. Consider consulting a nutritionist for healthy weight gain strategies.";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = "Normal";
            className = "bmi-normal";
            desc = "Great job! Your BMI falls within the healthy range for your height.";
        } else if (bmi >= 25 && bmi < 29.9) {
            category = "Overweight";
            className = "bmi-overweight";
            desc = "Your BMI is slightly above average. Regular exercise and a balanced diet can help.";
        } else {
            category = "Obese";
            className = "bmi-obese";
            desc = "Your BMI is higher than average. We recommend consulting a healthcare provider for personalized advice.";
        }

        catText.textContent = category;
        catText.className = className;
        descEl.textContent = desc;
    }

    /* ----------------------------------------------------
       🚪 LOGOUT FUNCTIONALITY
    ---------------------------------------------------- */
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.removeEventListener("click", () => { }); // Clear old listeners if any
        // Use a fresh cloned node to be safe? No, just adding new listener is fine if we manage it right.
        // Actually, dashboard.js might have a listener too if we didn't fully clean it.
        // But our new profile.js runs on DOMContentLoaded.

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("eatwise_logged_in");
                localStorage.removeItem("eatwise_user");
                localStorage.removeItem("eatwiseEmail");
                localStorage.removeItem("eatwiseProfile");
                sessionStorage.clear();
                window.location.href = "../public/login.html";
            }
        });
    }
});
