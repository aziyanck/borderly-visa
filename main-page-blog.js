import supabase from "./supabase-blog-app.js";

async function initializeCarousel() {
    const container = document.getElementById("carousel")
    if (!container) return;

    const { data: blogs, error } = await supabase
        .from("blogs")
        .select()
        .eq("published", true)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching blogs:", error);
        container.innerHTML = `<p class="text-slate-500">Loading blog posts failed...</p>`
        return
    }

    if (blogs && blogs.length === 0) {
        container.innerHTML = `<p class="text-slate-500">No Blogs</p>`
        return
    }

    // Clear loading/default state
    container.innerHTML = '';

    blogs.forEach(blog => {
        const blogCard = document.createElement("div")
        blogCard.classList.add("flex-shrink-0", "w-80", "bg-white", "rounded-xl", "shadow-lg", "overflow-hidden")

        const parseContent = (htmlString) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;

            const imageElement = tempDiv.querySelector('img');
            const imageUrl = imageElement ? imageElement.src : 'https://placehold.co/600x400/f8fafc/334155?text=Blog+Image';

            const textContent = tempDiv.textContent || "";

            return { imageUrl, textContent };
        };

        const { imageUrl, textContent } = parseContent(blog.content);

        blogCard.innerHTML = `
            <a href="/post.html?id=${blog.id}" class="block hover:bg-slate-50 transition-colors">
                <img src="${imageUrl}" alt="Blog Image" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-slate-900 truncate">
                        ${blog.title}
                    </h3>
                    <p class="mt-2 text-slate-600 text-sm h-10 overflow-hidden">
                        ${textContent.slice(0, 300)}...
                    </p>
                    <span class="mt-4 inline-block text-slate-700 group-hover:text-slate-900 font-semibold text-sm">
                        Read More &rarr;
                    </span>
                </div>
            </a>
            `
        container.appendChild(blogCard)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCarousel()
})
