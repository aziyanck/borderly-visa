// supabase-blog-app.js

// Import Supabase client library
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// IMPORTANT: Replace with your actual Supabase project URL and Anon Key
// You can find these in your Supabase project settings -> API
const SUPABASE_URL = "https://nkpfjbpkcqcbfgvcbtgh.supabase.co" // Paste your Project URL here
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcGZqYnBrY3FjYmZndmNidGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTI1ODMsImV4cCI6MjA2NTk4ODU4M30.lneP7rlhOMDT2D3rtHUMC9sUqOigMNEPHAx7lDWkYZI" // Paste your anon public key here

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
console.log("Supabase client initialized with URL:", SUPABASE_URL)

// --- General UI Elements & Helper Functions ---

// Function to display messages (e.g., success, error) to the user
function displayMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId)
  if (messageElement) {
    messageElement.textContent = message
    messageElement.classList.remove("hidden", "text-red-500", "text-green-500")
    if (isError) {
      messageElement.classList.add("text-red-500")
    } else {
      messageElement.classList.add("text-green-500")
    }
    // console.log(`Displaying message for ${elementId}: ${message}`); // Debugging line
    setTimeout(() => {
      if (messageElement) {
        // Check if element still exists before trying to clear
        messageElement.classList.add("hidden")
        messageElement.textContent = ""
      }
    }, 5000) // Hide message after 5 seconds
  }
}

// Function to redirect to a new URL
function redirectTo(path) {
  window.location.href = path
}

// --- Supabase Authentication Logic (for admin.html and editor.html) ---

async function handleLogin(event) {
  event.preventDefault() // Prevent default form submission

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const loginMessage = document.getElementById("login-message")
  const loginButton = event.submitter // Get the button that triggered the submit

  if (!emailInput || !passwordInput || !loginMessage || !loginButton) {
    console.error("Login form elements not found. Cannot proceed with login.")
    return
  }

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  if (!email || !password) {
    displayMessage(
      "login-message",
      "Please enter both email and password.",
      true,
    )
    return
  }

  loginButton.disabled = true // Disable button to prevent multiple clicks
  loginButton.textContent = "Logging In..."
  displayMessage("login-message", "Attempting to log in...")

  try {
    // Sign in the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error("Supabase Login error:", error) // Log the full error object
      displayMessage(
        "login-message",
        `Login failed: ${error.message}. Please check your credentials.`,
        true,
      )
    } else if (data.user) {
      console.log("User logged in successfully:", data.user)
      displayMessage("login-message", "Login successful! Redirecting...", false)
      // Redirect to the editor page after successful login
      redirectTo("/admin/editor.html")
    } else {
      // This case should ideally be caught by error, but as a fallback
      console.warn("Login returned no user or error:", data)
      displayMessage(
        "login-message",
        "Login failed: Unknown issue. Please try again.",
        true,
      )
    }
  } catch (unexpectedError) {
    console.error("Unexpected error during login:", unexpectedError)
    displayMessage(
      "login-message",
      "An unexpected error occurred during login. Please try again.",
      true,
    )
  } finally {
    loginButton.disabled = false // Re-enable button
    loginButton.textContent = "Log In"
  }
}

async function handleLogout() {
  console.log("Attempting to log out...")
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Supabase Logout error:", error.message)
    alert("Failed to log out. Please try again.") // Simple alert for now
  } else {
    console.log("User logged out successfully.")
    // Redirect to the login page after logout
    redirectTo("/admin.html")
  }
}

// --- Quill Editor Logic & Blog Management (for editor.html) ---

let quill // Declare quill globally for editor.html to access

async function initializeEditorPage() {
  console.log("Initializing editor page...")
  // Check if the user is authenticated
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Error fetching session:", sessionError.message)
    redirectTo("/admin.html")
    return
  }

  if (!session) {
    console.log("No active session found. Redirecting to login.")
    // If no session, redirect to login page
    redirectTo("/admin.html")
    return
  }
  console.log("User session found:", session.user.email)

  // Initialize Quill editor once authentication is confirmed
  quill = new Quill("#editor-container", {
    theme: "snow", // 'snow' or 'bubble'
    placeholder: "Write your blog content here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"], // link, image, video
        ["clean"], // remove formatting button
      ],
    },
  })
  console.log("Quill editor initialized.")

  // Event listeners for Save Draft and Publish buttons
  document
    .getElementById("save-draft-button")
    ?.addEventListener("click", () => saveBlogPost(false))
  document
    .getElementById("publish-button")
    ?.addEventListener("click", () => saveBlogPost(true))
  document
    .getElementById("logout-button")
    ?.addEventListener("click", handleLogout)
}

async function saveBlogPost(isPublished) {
  const titleInput = document.getElementById("blog-title")
  const editorMessage = document.getElementById("editor-message")
  const saveButton = isPublished
    ? document.getElementById("publish-button")
    : document.getElementById("save-draft-button")

  if (!titleInput || !editorMessage || !saveButton) {
    console.error("Editor form elements not found. Cannot save blog post.")
    return
  }

  const title = titleInput.value.trim()
  // Check if the Quill editor instance exists before accessing its methods
  const content = quill ? quill.root.innerHTML : ""

  if (!title) {
    displayMessage("editor-message", "Blog title cannot be empty.", true)
    return
  }

  // Check if editor content is empty (excluding just whitespace or only images)
  // quill.getContents().length === 1 && quill.getContents().ops[0].insert === '\n' means only a newline char
  if (
    !quill ||
    (quill.getText().trim() === "" &&
      !quill
        .getContents()
        .some(
          (item) =>
            item.insert &&
            typeof item.insert === "object" &&
            !item.insert.image,
        ))
  ) {
    // This condition now correctly checks for empty text and non-image objects
    // If there's only an image, quill.getText() would be empty.
    // The check `!quill.getContents().some(item => item.insert && (typeof item.insert === 'object' && !item.insert.image))`
    // ensures that if the content is JUST an image, it's still considered valid.
    // We're looking for content that isn't just an image or empty text.
    // A more robust check might be `quill.getContents().length <= 1 && quill.getContents().ops[0].insert === '\n'` for truly empty.
    // For simplicity, let's just make sure there's *something* in the content or text.

    // Simpler check: if the text content is empty AND there are no embeds (like images/videos)
    if (
      quill.getText().trim() === "" &&
      quill.getContents().filter((op) => typeof op.insert === "object")
        .length === 0
    ) {
      displayMessage("editor-message", "Blog content cannot be empty.", true)
      return
    }
  }

  saveButton.disabled = true
  saveButton.textContent = isPublished ? "Publishing..." : "Saving Draft..."
  displayMessage(
    "editor-message",
    `Saving blog post as ${isPublished ? "published" : "draft"}...`,
  )

  // Get the current user's ID
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error(
      "User authentication error during save:",
      userError?.message || "No user found",
    )
    displayMessage(
      "editor-message",
      "User not authenticated. Please log in again.",
      true,
    )
    redirectTo("/admin.html")
    return
  }

  try {
    const { data, error } = await supabase
      .from("blogs") // Your Supabase table name for blogs
      .insert(
        [
          {
            title: title,
            content: content,
            published: isPublished,
            author_id: user.id, // Store the author's ID
          },
        ],
        { returning: "minimal" },
      ) // Use returning: 'minimal' for better performance

    if (error) {
      console.error("Error saving blog post to Supabase:", error)
      displayMessage(
        "editor-message",
        `Failed to save blog post: ${error.message}`,
        true,
      )
    } else {
      console.log("Blog post saved successfully.")
      displayMessage(
        "editor-message",
        `Blog post ${isPublished ? "published" : "saved as draft"} successfully!`,
        false,
      )
      // Clear the form after successful save
      titleInput.value = ""
      quill.setContents([]) // Clear Quill editor
    }
  } catch (unexpectedError) {
    console.error("Unexpected error during blog save:", unexpectedError)
    displayMessage(
      "editor-message",
      "An unexpected error occurred while saving. Please try again.",
      true,
    )
  } finally {
    saveButton.disabled = false
    saveButton.textContent = isPublished ? "Publish Blog" : "Save Draft"
  }
}

// --- Frontend Blog Display Logic (for blog.html) ---

async function fetchAndDisplayBlogPosts() {
  const blogContainer = document.getElementById("blog-posts-container")
  console.log("Checking for blog container:", blogContainer) // Debugging line
  if (!blogContainer) {
    console.log("Blog container not found, exiting fetchAndDisplayBlogPosts.")
    return // Exit if container doesn't exist on this page
  }

  // Set initial loading message
  blogContainer.innerHTML = `
        <div class="col-span-full p-6 bg-white rounded-lg shadow-md flex items-center justify-center">
            <p class="text-slate-500">Loading blog posts...</p>
        </div>
    `
  console.log("Attempting to fetch blog posts for frontend display...")

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true) // Only fetch published posts for the frontend
    .order("created_at", { ascending: false }) // Order by newest first

  if (error) {
    console.error("Error fetching blog posts for frontend:", error)
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-red-500">Failed to load blog posts.</div>'
    return
  }

  if (blogs.length === 0) {
    console.log("No published blog posts found.")
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-slate-500">No blog posts published yet.</div>'
    return
  }

  console.log("Fetched blog posts:", blogs)
  blogContainer.innerHTML = "" // Clear loading message

  blogs.forEach((blog) => {
    const blogPostElement = document.createElement("div")
    blogPostElement.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md")
    blogPostElement.setAttribute("data-aos", "fade-up") // Add AOS animation

    // Format date nicely
    const postDate = new Date(blog.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Ensure the content is safely rendered.
    // The `prose` class should be sufficient if you have the @tailwindcss/typography plugin,
    // otherwise, the custom styles in style.css will help.
    blogPostElement.innerHTML = `
            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">${blog.title}</h3>
            <p class="text-sm text-slate-500 mb-4">Published on: ${postDate}</p>
            <div class="prose max-w-none text-slate-700 leading-relaxed">${blog.content}</div>
        `
    blogContainer.appendChild(blogPostElement)
  })
  AOS.refresh() // Refresh AOS to pick up new elements
}

// --- Event Listeners based on current page ---

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname
  console.log("DOMContentLoaded - Current path:", currentPath)

  if (currentPath.includes("/admin.html")) {
    // This is the admin login page
    console.log("On admin.html - attaching login form listener.")
    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin)
  } else if (currentPath.includes("/admin/editor.html")) {
    // This is the admin editor page
    console.log("On editor.html - initializing editor page.")
    initializeEditorPage()
  } else if (currentPath.includes("/blog.html")) {
    // This is the frontend blog display page
    console.log("On blog.html - fetching and displaying blog posts.")
    AOS.init({
      // Initialize AOS for blog.html specifically here
      offset: 120,
      duration: 600,
      easing: "ease-in-out",
      once: true,
    })
    fetchAndDisplayBlogPosts()
  } else {
    // This is the main index.html page
    console.log("On index.html - attaching mobile menu listeners.")
    // Existing mobile menu logic (from your original script.js)
    const mobileMenuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")
    const mobileMenuLinks = mobileMenu?.querySelectorAll("a")

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu?.classList.toggle("hidden")
      })
    }

    mobileMenuLinks?.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu?.classList.add("hidden")
      })
    })
    // AOS.init for index.html is in its own script tag in index.html's head
  }
})
