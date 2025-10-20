import { supabase } from "../supabase.js";
const authButtons = document.getElementsByClassName("auth-cont");
async function checkSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking session:", error.message);
      return null;
    }

    if (!session) {
      console.log("No active session. User is not logged in.");
      return null;
    }

    // Session exists, return user data
    console.log("User is authenticated:", session.user);
    return session.user;
  } catch (error) {
    console.error("Unexpected error checking session:", error.message);
    return null;
  }
}

// Example usage in your questionnaire.js
document.addEventListener("DOMContentLoaded", async () => {
  // Check session before proceeding
  console.log(Array.from(authButtons));

  const user = await checkSession();
  user
    ? Array.from(authButtons).forEach((e) => {
        e.style.display = "none";
      })
    : console.log("user is not authenticated");

  // Existing code for questionnaire logic
  const steps = document.querySelectorAll(".step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  let currentStep = 0;
  const totalSteps = steps.length;

  // ... rest of your existing code ...
});
