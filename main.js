import { handleLogin, handleLogout } from "./src/auth.js"
import {
  initializeEditorPage,
  fetchAndDisplayBlogPosts,
  fetchAndDisplaySinglePost,
  initializeCarousel,
} from "./src/blog-posts.js"
import { handleMobileMenu, showAuthModal } from "./src/ui.js"
import supabase from "./src/supabase-client.js"

async function updateUserStatus() {
  const { data: { user } } = await supabase.auth.getUser()
  const userInfo = document.getElementById("user-info")
  const loginButton = document.getElementById("login-button")
  const logoutButton = document.getElementById("logout-button")
  const mobileUserInfo = document.getElementById("mobile-user-info")
  const mobileLoginButton = document.getElementById("mobile-login-button")
  const mobileLogoutButton = document.getElementById("mobile-logout-button")

  if (user) {
    userInfo.textContent = user.email
    userInfo.classList.remove("hidden")
    logoutButton.classList.remove("hidden")
    loginButton.classList.add("hidden")

    mobileUserInfo.textContent = user.email
    mobileUserInfo.classList.remove("hidden")
    mobileLogoutButton.classList.remove("hidden")
    mobileLoginButton.classList.add("hidden")
  } else {
    userInfo.classList.add("hidden")
    logoutButton.classList.add("hidden")
    loginButton.classList.remove("hidden")

    mobileUserInfo.classList.add("hidden")
    mobileLogoutButton.classList.add("hidden")
    mobileLoginButton.classList.remove("hidden")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname

  if (currentPath.includes("/admin/login.html")) {
    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin)
  } else if (currentPath.includes("/admin/editor.html")) {
    initializeEditorPage()
    document
      .getElementById("logout-button")
      ?.addEventListener("click", handleLogout)
  } else if (currentPath.includes("/blog.html")) {
    AOS.init({
      offset: 120,
      duration: 600,
      easing: "ease-in-out",
      once: true,
    })
    fetchAndDisplayBlogPosts()
  } else if (currentPath.includes("/post.html")) {
    fetchAndDisplaySinglePost()
  } else if (currentPath === "/" || currentPath.includes("/index.html")) {
    initializeCarousel()
    updateUserStatus()
    document.getElementById("login-button")?.addEventListener("click", () => showAuthModal(updateUserStatus))
    document.getElementById("logout-button")?.addEventListener("click", handleLogout)
    document.getElementById("mobile-login-button")?.addEventListener("click", () => showAuthModal(updateUserStatus))
    document.getElementById("mobile-logout-button")?.addEventListener("click", handleLogout)
  } else if (currentPath.includes("/apply.html")) {
    // check if logged in
  } 

  handleMobileMenu()
})
