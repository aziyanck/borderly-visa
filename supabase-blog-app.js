import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://nkpfjbpkcqcbfgvcbtgh.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcGZqYnBrY3FjYmZndmNidGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTI1ODMsImV4cCI6MjA2NTk4ODU4M30.lneP7rlhOMDT2D3rtHUMC9sUqOigMNEPHAx7lDWkYZI" // Paste your anon public key here

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 


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
    setTimeout(() => {
      if (messageElement) {
        messageElement.classList.add("hidden")
        messageElement.textContent = ""
      }
    }, 5000) 
  }
}

function redirectTo(path) {
  window.location.href = path
}


async function handleLogin(event) {
  event.preventDefault() 

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const loginMessage = document.getElementById("login-message")
  const loginButton = event.submitter 

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

  loginButton.disabled = true 
  loginButton.textContent = "Logging In..."
  displayMessage("login-message", "Attempting to log in...")

  try {
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.error("Supabase Login error:", error) 
      displayMessage(
        "login-message",
        `Login failed: ${error.message}. Please check your credentials.`,
        true,
      )
    } else if (data.user) {
       
      displayMessage("login-message", "Login successful! Redirecting...", false)
      redirectTo("/admin/editor.html")
    } else {
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
    loginButton.disabled = false 
    loginButton.textContent = "Log In"
  }
}

async function handleLogout() {
   
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Supabase Logout error:", error.message)
    alert("Failed to log out. Please try again.") 
  } else {
     
    redirectTo("/")
  }
}


let quill 

async function initializeEditorPage() {
   
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Error fetching session:", sessionError.message)
    redirectTo("/admin/admin.html")
    return
  }

  if (!session) {
     
    redirectTo("/admin/admin.html")
    return
  }
   

  quill = new Quill("#editor-container", {
    theme: "snow", 
    placeholder: "Write your blog content here...",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], 
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], 
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }], 
        [{ direction: "rtl" }], 
        [{ size: ["small", false, "large", "huge"] }], 
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], 
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"], 
        ["clean"], 
      ],
    },
  })
   

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
  const content = quill ? quill.root.innerHTML : ""

  if (!title) {
    displayMessage("editor-message", "Blog title cannot be empty.", true)
    return
  }

    if (
      quill.getText().trim() === "" &&
      quill.getContents().filter((op) => typeof op.insert === "object")
        .length === 0
    ) {
      displayMessage("editor-message", "Blog content cannot be empty.", true)
      return
    }
  
  saveButton.disabled = true
  saveButton.textContent = isPublished ? "Publishing..." : "Saving Draft..."
  displayMessage(
    "editor-message",
    `Saving blog post as ${isPublished ? "published" : "draft"}...`,
  )

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
    redirectTo("/admin/admin.html")
    return
  }

  try {
    const { data, error } = await supabase
      .from("blogs")
      .insert(
        [
          {
            title: title,
            content: content,
            published: isPublished,
            author_id: user.id,
          },
        ],
        { returning: "minimal" },
      ) 

    if (error) {
      console.error("Error saving blog post to Supabase:", error)
      displayMessage(
        "editor-message",
        `Failed to save blog post: ${error.message}`,
        true,
      )
    } else {
       
      displayMessage(
        "editor-message",
        `Blog post ${isPublished ? "published" : "saved as draft"} successfully!`,
        false,
      )
      titleInput.value = ""
      quill.setContents([]) 
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

async function fetchAndDisplayBlogPosts() {
  const blogContainer = document.getElementById("blog-posts-container")
   
  if (!blogContainer) {
     
    return
  }

  
  blogContainer.innerHTML = `
        <div class="col-span-full p-6 bg-white rounded-lg shadow-md flex items-center justify-center">
            <p class="text-slate-500">Loading blog posts...</p>
        </div>
    `
   

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select()
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts for frontend:", error)
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-red-500">Failed to load blog posts.</div>'
    return
  }

  if (blogs.length === 0) {
     
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-slate-500">No blog posts published yet.</div>'
    return
  }

   
  blogContainer.innerHTML = "" 

  blogs.forEach((blog) => {
    const blogPostElement = document.createElement("div")
    blogPostElement.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md")
    blogPostElement.setAttribute("data-aos", "fade-up") 

  
    const postDate = new Date(blog.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    blogPostElement.innerHTML = `
            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">${blog.title}</h3>
            <p class="text-sm text-slate-500 mb-4">Published on: ${postDate}</p>
            <div class="prose max-w-none text-slate-700 leading-relaxed">${blog.content}</div>
        `
    blogContainer.appendChild(blogPostElement)
  })
  AOS.refresh() 
}


document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname
   

  if (currentPath.includes("/admin.html")) {
     
    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin)
  } else if (currentPath.includes("/admin/editor.html")) {
     
    initializeEditorPage()
  } else if (currentPath.includes("/blog.html")) {
     
    AOS.init({
      offset: 120,
      duration: 600,
      easing: "ease-in-out",
      once: true,
    })
    fetchAndDisplayBlogPosts()
  } else {
     
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
  }
})

export default supabase