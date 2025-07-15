import { handleLogin, handleLogout } from "./src/auth.js"
import {
  initializeEditorPage,
  fetchAndDisplayBlogPosts,
  fetchAndDisplaySinglePost,
  initializeCarousel,
} from "./src/blog-posts.js"
import { handleMobileMenu } from "./src/ui.js"

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname

  if (currentPath.includes("/admin.html")) {
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
  }

  handleMobileMenu()
})
