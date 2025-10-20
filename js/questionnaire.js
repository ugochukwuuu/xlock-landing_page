import { supabase } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  let currentStep = 0;
  const totalSteps = steps.length;

  const showStep = (step) => {
    steps.forEach((s, i) => s.classList.toggle("active", i === step));
    prevBtn.style.display = step > 0 ? "block" : "none";
    nextBtn.textContent = step === totalSteps - 1 ? "Finish" : "Next";
    progressBar.style.width = `${((step + 1) / totalSteps) * 100}%`;
  };

  const validateStep = (step) => {
    let isValid = true;
    // Step-specific validation (add more as needed)
    if (step === 0) {
      const assetsChecked = document.querySelectorAll(
        'input[name="assets[]"]:checked',
      ).length;
      if (assetsChecked === 0) {
        document.getElementById("assetsError").textContent =
          "Please select at least one asset type.";
        isValid = false;
      }
    }
    if (step === 1) {
      const goalsChecked = document.querySelectorAll(
        'input[name="goals[]"]:checked',
      ).length;
      if (goalsChecked > 3) {
        document.getElementById("goalsError").textContent =
          "Please select up to 3 goals.";
        isValid = false;
      }
      if (!document.querySelector('input[name="experience"]:checked')) {
        document.getElementById("experienceError").textContent =
          "Please select your experience level.";
        isValid = false;
      }
      if (!document.getElementById("investmentAmount").value) {
        document.getElementById("amountError").textContent =
          "Please select an investment amount.";
        isValid = false;
      }
    }
    // Step 3 is mostly optional, no strict validation
    return isValid;
  };

  prevBtn.addEventListener("click", () => {
    currentStep--;
    showStep(currentStep);
  });

  nextBtn.addEventListener("click", async () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Collect questionnaire data
        const formData = new FormData(
          document.getElementById("questionnaireForm"),
        );
        const prefs = {};
        formData.forEach((value, key) => {
          if (key.endsWith("[]")) {
            key = key.slice(0, -2);
            if (!prefs[key]) prefs[key] = [];
            prefs[key].push(value);
          } else {
            prefs[key] = value;
          }
        });

        // Retrieve pending registration from localStorage
        const pendingReg = JSON.parse(
          localStorage.getItem("pendingRegistration"),
        );
        if (!pendingReg) {
          alert("Session expired. Please start registration again.");
          window.location.href = "index.html";
          return;
        }

        try {
          // Register user
          const { data, error } = await supabase.auth.signUp({
            email: pendingReg.email,
            password: pendingReg.password,
            options: {
              data: { full_name: pendingReg.fullName },
            },
          });

          if (error) throw error;

          // Save preferences to customer_preferences table and retrieve the inserted row
          const { data: prefsData, error: prefsError } = await supabase
            .from("customer_preferences")
            .insert({
              user_id: data.user.id,
              assets: prefs.assets || [],
              risk_tolerance: parseInt(prefs.riskTolerance) || null,
              investment_horizon: prefs.investmentHorizon || null,
              goals: prefs.goals || [],
              experience: prefs.experience || null,
              investment_amount: prefs.investmentAmount || null,
              restrictions: prefs.restrictions || [],
              comments: prefs.comments || null,
            })
            .select("id")
            .single();

          if (prefsError) throw prefsError;

          // Insert into customers table
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .insert({
              user_id: data.user.id,
              user_preference_id: prefsData.id,
              fullname: pendingReg.fullName,
              email: pendingReg.email,
            })
            .select("id")
            .single();

          if (customerError) throw customerError;

          alert("Registration complete! Check your email for verification.");
          await supabase
            .from("notifications")
            .insert({
              customer_id: customerData.id,
              message: `Welcome to X-Lock!, ${pendingReg.fullName}`,
            });
          localStorage.removeItem("pendingRegistration");
          window.location.href = "index.html"; // Redirect back to home
        } catch (error) {
          alert("Error completing registration: " + error.message);
        }
      }
    }
  });

  showStep(currentStep);

  // Handle 'other' inputs
  document.getElementById("otherAssets").addEventListener("change", (e) => {
    document.getElementById("otherAssetsText").style.display = e.target.checked
      ? "block"
      : "none";
  });
  document.getElementById("otherGoals").addEventListener("change", (e) => {
    document.getElementById("otherGoalsText").style.display = e.target.checked
      ? "block"
      : "none";
  });

  // Update slider value display
  document.getElementById("riskTolerance").addEventListener("input", (e) => {
    document.getElementById("riskValue").textContent = e.target.value;
  });
});
