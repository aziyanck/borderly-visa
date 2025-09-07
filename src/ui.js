import supabase from "./supabase-client.js"
function displayMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.remove('hidden', 'text-red-500', 'text-green-500');
    if (isError) {
      messageElement.classList.add('text-red-500');
    } else {
      messageElement.classList.add('text-green-500');
    }
    setTimeout(() => {
      if (messageElement) {
        messageElement.classList.add('hidden');
        messageElement.textContent = '';
      }
    }, 5000);
  }
}

function redirectTo(path) {
  window.location.href = path;
}

function handleMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = mobileMenu?.querySelectorAll('a');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }

  mobileMenuLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });
}

async function showAuthModal() {
  const authModal = document.getElementById("auth-modal")
  const closeModalButton = document.getElementById("close-modal-button")
  const authForm = document.getElementById("auth-form")
  const authToggleButton = document.getElementById("auth-toggle-button")
  const modalTitle = document.getElementById("modal-title")
  const authSubmitButton = document.getElementById("auth-submit-button")
  const authPromptText = document.getElementById("auth-prompt-text")

  let isLogin = true

  function toggleAuthMode() {
    isLogin = !isLogin
    modalTitle.textContent = isLogin ? "Log In" : "Sign Up"
    authSubmitButton.textContent = isLogin ? "Log In" : "Sign Up"
    authPromptText.textContent = isLogin
      ? "Don't have an account?"
      : "Already have an account?"
    authToggleButton.textContent = isLogin ? "Sign Up" : "Log In"
    document.getElementById("auth-message").classList.add("hidden")
  }

  authToggleButton.addEventListener("click", toggleAuthMode)

  authModal.classList.remove("hidden")

  closeModalButton.addEventListener("click", () => {
    authModal.classList.add("hidden")
  })

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("auth-email").value
    const password = document.getElementById("auth-password").value
    const authMessage = document.getElementById("auth-message")

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          displayMessage(
            "auth-message",
            "User does not exist. Please sign up.",
            true,
          )
        } else {
          displayMessage("auth-message", error.message, true)
        }
      } else if (data.user) {
        redirectTo("/apply.html")
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        if (error.message.includes("already registered")) {
          displayMessage(
            "auth-message",
            "You are already registered. Please log in.",
            true,
          )
        } else {
          displayMessage("auth-message", error.message, true)
        }
      } else if (data.user) {
        displayMessage(
          "auth-message",
          "Signup successful! Please check your email to verify your account.",
          false,
        )
        setTimeout(() => {
          authModal.classList.add("hidden")
        }, 3000)
      }
    }
  })
}

export { displayMessage, redirectTo, handleMobileMenu, showAuthModal };

