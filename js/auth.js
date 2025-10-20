import { supabase } from "../supabase";
const registerForm = document.getElementById("registerForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerButton = document.getElementById("registerButton");

const lemailInput = document.getElementById("lemail");
const lpasswordInput = document.getElementById("lpassword");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");

document.querySelectorAll(".password-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.dataset.target;
    const input = document.getElementById(targetId);
    const icon = toggle.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    }
  });
});

const errorElements = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirmPassword: document.getElementById("confirmPasswordError"),
  submit: document.getElementById("submitError"),
};

function clearErrors() {
  Object.values(errorElements).forEach((el) => (el.textContent = ""));
}

function validateForm() {
  clearErrors();
  let isValid = true;

  if (!fullNameInput.value.trim()) {
    errorElements.fullName.textContent = "Full name is required.";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    errorElements.email.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (passwordInput.value.length < 6) {
    errorElements.password.textContent =
      "Password must be at least 6 characters.";
    isValid = false;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    errorElements.confirmPassword.textContent = "Passwords do not match.";
    isValid = false;
  }

  return isValid;
}
function validateLoginForm() {
  clearErrors();
  let isValid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lemailInput.value)) {
    errorElements.email.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (lpasswordInput.value.length < 6) {
    errorElements.password.textContent =
      "Password must be at least 6 characters.";
    isValid = false;
  }

  return isValid;
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  console.log("Supabase client created:", supabase);
  registerButton.disabled = true;
  registerButton.textContent = "Checking...";

  // Check if email exists
  const { data: existsData, error: checkError } = await supabase.rpc(
    "check_email_exists",
    { p_email: emailInput.value },
  );

  registerButton.disabled = false;
  registerButton.textContent = "Register";

  if (checkError) {
    errorElements.submit.textContent =
      "Error checking email. Please try again.";
    return;
  }

  if (existsData) {
    errorElements.submit.textContent =
      "Account with this email already exists. Please sign in or reset your password.";
    return;
  }

  // Store details temporarily in localStorage and redirect to questionnaire
  localStorage.setItem(
    "pendingRegistration",
    JSON.stringify({
      fullName: fullNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    }),
  );

  // Redirect to questionnaire page
  window.location.href = "questionnaire.html";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginButton.textContent = "Loggin in...";
  if (!validateLoginForm()) return;
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: "someone@email.com",
      password: "xlrlTCGAMvmgiTgwdgtx",
    });

    console.log(data);
    if (!error) {
      window.reload();
    }
  } catch (error) {
    console.error(error);
  }
});
