document.addEventListener('DOMContentLoaded', async () => {
    // Import Supabase Client
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    
    // Initialize Supabase Client
    const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key
    const supabase = createClient(supabaseUrl, supabaseKey);
  
    const form = document.getElementById('registerForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const registerBtn = document.getElementById('registerButton');
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const submitError = document.getElementById('submitError');
  
    // Regex Patterns
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Validation Function
    const validateForm = () => {
      let isValid = true;
      fullNameError.textContent = '';
      emailError.textContent = '';
      passwordError.textContent = '';
      confirmPasswordError.textContent = '';
      submitError.textContent = '';
  
      if (fullName.value.trim() === '' && fullName.value !== '') {
        fullNameError.textContent = 'Full name cannot contain only spaces.';
        isValid = false;
      }
  
      if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Please enter a valid email address (e.g., user@example.com).';
        isValid = false;
      }
  
      if (!passwordRegex.test(password.value)) {
        passwordError.textContent = 'Password must be at least 8 characters long, include a letter, a number, and a special character (@$!%*?&).';
        isValid = false;
      }
  
      if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
      }
  
      return isValid;
    };
 
    window.addEventListener('load', () => {
  alert("All page resources have finished loading!");
});

    registerBtn.addEventListener('click',(e)=>{
      alert('hello world')
      e.preventDefault();
    })
    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
      alert('hello world')
      e.preventDefault();
      if (validateForm()) {
        const formData = {
          fullName: fullName.value,
          email: email.value,
          password: password.value,
        };

        alert('i think we are all good here fam')
  
        // try {
        //   const { data, error } = await supabase.auth.signUp({
        //     email: formData.email,
        //     password: formData.password,
        //     options: {
        //       data: { full_name: formData.fullName },
        //     },
        //   });
  
        //   if (error) {
        //     submitError.textContent = error.message || 'Registration failed. Please try again.';
        //   } else {
        //     alert('Registration successful! Check your email for confirmation.');
        //     form.reset();
        //     bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        //   }
        // } catch (error) {
        //   submitError.textContent = 'An error occurred. Please try again later.';
        // }
      }
    });
  });