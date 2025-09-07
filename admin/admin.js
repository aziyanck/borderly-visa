import supabase from "../src/supabase-client.js"
import { redirectTo } from "../src/ui.js"

const adminContent = document.getElementById("admin-content")
const loadingState = document.getElementById("loading-state")
const errorState = document.getElementById("error-state")
const applicationsTableBody = document.getElementById(
  "applications-table-body",
)
const logoutButton = document.getElementById("logout-button")

// Modal elements
const documentModal = document.getElementById("document-modal")
const closeModalButton = document.getElementById("close-modal-button")
const documentLinksContainer = document.getElementById("document-links")

// Notification elements
const notificationPopup = document.getElementById("notification-popup")
const notificationMessage = document.getElementById("notification-message")

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirectTo("/admin/login.html")
    return
  }

  try {
    const { data: role, error: roleError } = await supabase.rpc("get_user_role")

    if (roleError) {
      throw new Error(roleError.message)
    }

    if (role !== "admin") {
      showErrorState()
      return
    }

    showAdminContent()
    await fetchAndDisplayApplications()
  } catch (error) {
    console.error("Error checking user role:", error)
    showErrorState()
  }
})

logoutButton.addEventListener("click", async () => {
  await supabase.auth.signOut()
  redirectTo("/")
})

closeModalButton.addEventListener("click", () => {
  documentModal.classList.add("hidden")
})

async function fetchAndDisplayApplications() {
  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")

    if (error) {
      throw new Error(error.message)
    }

    applicationsTableBody.innerHTML = ""

    if (applications.length === 0) {
      applicationsTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">No applications found.</td></tr>`
      return
    }

    for (const app of applications) {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${app.full_name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${app.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${app.destination}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <select data-appid="${app.id}" data-original-status="${app.status}" class="status-select bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option ${app.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
            <option ${app.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button data-appid="${app.id}" class="view-documents-btn text-blue-600 hover:underline">View Documents</button>
        </td>
      `
      applicationsTableBody.appendChild(row)
    }

    document.querySelectorAll(".view-documents-btn").forEach(button => {
      button.addEventListener("click", handleViewDocuments)
    })

    document.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", handleStatusUpdate)
    })

  } catch (error) {
    console.error("Error fetching applications:", error)
    applicationsTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Error loading applications.</td></tr>`
  }
}

async function handleStatusUpdate(event) {
  const selectElement = event.target
  const applicationId = selectElement.dataset.appid
  const newStatus = selectElement.value
  const originalStatus = selectElement.dataset.originalStatus

  const confirmed = confirm(`Are you sure you want to change the status to "${newStatus}"?`)

  if (!confirmed) {
    selectElement.value = originalStatus // Revert the change
    return
  }

  selectElement.disabled = true

  try {
    const { data, error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId)
      .select() // Ask for the updated row back

    if (error) {
      // This catches network errors and some database errors
      throw error
    }

    if (!data || data.length === 0) {
      // This is the crucial check for RLS failures
      throw new Error("Update failed. This may be due to row-level security policies.")
    }

    // Update the original status so reverting works correctly next time
    selectElement.dataset.originalStatus = newStatus
    showNotification("Status updated successfully!", false)

  } catch (error) {
    console.error("Error updating status:", error)
    showNotification(error.message, true)
    selectElement.value = originalStatus // Revert on failure
  } finally {
    selectElement.disabled = false
  }
}

async function handleViewDocuments(event) {
  const applicationId = event.target.dataset.appid
  documentLinksContainer.innerHTML = "<p>Loading document links...</p>"
  documentModal.classList.remove("hidden")

  try {
    const { data: files, error: listError } = await supabase.storage
      .from("visa-documents")
      .list(`${applicationId}`)

    if (listError) throw listError

    if (!files || files.length === 0) {
      documentLinksContainer.innerHTML = "<p>No documents found for this application.</p>"
      return
    }

    documentLinksContainer.innerHTML = ""

    for (const file of files) {
      const { data, error: urlError } = await supabase.storage
        .from("visa-documents")
        .createSignedUrl(`${applicationId}/${file.name}`, 60) // URL valid for 60 seconds

      if (urlError) throw urlError

      const link = document.createElement("a")
      link.href = data.signedUrl
      link.textContent = `View ${file.name}`
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.className = "block text-blue-600 hover:underline"
      documentLinksContainer.appendChild(link)
    }
  } catch (error) {
    console.error("Error preparing document links:", error)
    documentLinksContainer.innerHTML = `<p class="text-red-500">Failed to load document links.</p>`
  }
}

function showNotification(message, isError = false) {
  notificationMessage.textContent = message
  notificationPopup.classList.remove("hidden", "bg-green-500", "bg-red-500", "translate-x-full")

  if (isError) {
    notificationPopup.classList.add("bg-red-500")
  } else {
    notificationPopup.classList.add("bg-green-500")
  }

  // Animate in
  setTimeout(() => {
    notificationPopup.classList.remove("translate-x-full")
  }, 10)

  // Hide after 3 seconds
  setTimeout(() => {
    notificationPopup.classList.add("translate-x-full")
    setTimeout(() => {
        notificationPopup.classList.add("hidden")
    }, 300)
  }, 3000)
}

function showAdminContent() {
  loadingState.classList.add("hidden")
  adminContent.classList.remove("hidden")
}

function showErrorState() {
  loadingState.classList.add("hidden")
  errorState.classList.remove("hidden")
}
