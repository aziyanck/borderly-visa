import supabase from "./supabase-blog-app.js";

async function initializeCarousel() {
    console.log("Initializing carousel...");
    const container = document.getElementById("carousel")

    const { data: blogs, error } = await supabase
        .from("blogs")
        .select()
        .eq("published", true) // Only fetch published posts for the frontend
        .order("created_at", { ascending: false }) // Order by newest first

    if (error) {
        console.error("Error fetching blogs:", error);
        container.innerHTML = `<p class="text-slate-500">Loading blog posts failed...</p>`
        return
    }

    if (blogs && blogs.length === 0) {
        container.innerHTML = `<p class="text-slate-500">No Blogs</p>`
        return
    }
console.log("Fetched blogs front:", blogs)
    blogs.forEach(blog => {
        const blogCard = document.createElement("div")
        blogCard.classList.add("flex-shrink-0", "w-80", "bg-white", "rounded-xl", "shadow-lg", "overflow-hidden")

        // --- Helper function to parse content ---
    const parseContent = (htmlString) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        
        const imageElement = tempDiv.querySelector('img');
        const imageUrl = imageElement ? imageElement.src : 'https://placehold.co/600x400'; // Fallback
        
        // Get text content without HTML tags
        const textContent = tempDiv.textContent || ""; 
        
        return { imageUrl, textContent };
    };

    const { imageUrl, textContent } = parseContent(blog.content);

        blogCard.innerHTML = `
            <img src="${imageUrl}" alt="Blog Image" class="w-full h-48 object-cover rounded-t-xl">
            <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900">
                ${blog.title}
                </h3>
                <p class="mt-2 text-slate-600 text-sm">
                ${textContent.slice(0, 100)}...
                </p>
                <a href="#" class="mt-4 inline-block text-slate-700 hover:text-slate-900 font-semibold text-sm">
                Read More &rarr;
                </a>
            </div>
            `
        container.appendChild(blogCard)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCarousel()
})