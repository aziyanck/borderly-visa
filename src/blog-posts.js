import supabase from './supabase-client.js';
import { displayMessage, redirectTo } from './ui.js';

let quill;

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function initializeEditorPage() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Error fetching session:', sessionError.message);
    redirectTo('/admin/admin.html');
    return;
  }

  if (!session) {
    redirectTo('/admin/admin.html');
    return;
  }

  quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Write your blog content here...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
  });

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (postId) {
    const { data: post, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', postId)
      .single();

    if (post) {
      document.getElementById('blog-title').value = post.title;
      document.getElementById('blog-slug').value = post.slug;
      quill.root.innerHTML = post.content;
      document.querySelector('.ql-editor').focus();
    }
  }

  document
    .getElementById('save-draft-button')
    ?.addEventListener('click', () => saveBlogPost(false, postId));
  document
    .getElementById('publish-button')
    ?.addEventListener('click', () => saveBlogPost(true, postId));

  fetchAndDisplayAdminBlogPosts();
}

async function saveBlogPost(isPublished, postId) {
  const titleInput = document.getElementById('blog-title');
  const slugInput = document.getElementById('blog-slug');
  const editorMessage = document.getElementById('editor-message');
  const saveButton = isPublished
    ? document.getElementById('publish-button')
    : document.getElementById('save-draft-button');

  if (!titleInput || !slugInput || !editorMessage || !saveButton) {
    console.error('Editor form elements not found. Cannot save blog post.');
    return;
  }

  const title = titleInput.value.trim();
  let slug = slugInput.value.trim();
  const content = quill ? quill.root.innerHTML : '';

  if (!title) {
    displayMessage('editor-message', 'Blog title cannot be empty.', true);
    return;
  }

  if (slug) {
    slug = createSlug(slug);
  } else {
    slug = createSlug(title);
  }
  slugInput.value = slug;

  if (
    quill.getText().trim() === '' &&
    quill.getContents().filter((op) => typeof op.insert === 'object').length ===
      0
  ) {
    displayMessage('editor-message', 'Blog content cannot be empty.', true);
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = isPublished ? 'Publishing...' : 'Saving Draft...';
  displayMessage(
    'editor-message',
    `Saving blog post as ${isPublished ? 'published' : 'draft'}...`
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error(
      'User authentication error during save:',
      userError?.message || 'No user found'
    );
    displayMessage(
      'editor-message',
      'User not authenticated. Please log in again.',
      true
    );
    redirectTo('/admin/admin.html');
    return;
  }

  try {
    const { data: existingPost, error: selectError } = await supabase
      .from('blogs')
      .select('slug')
      .eq('slug', slug)
      .not('id', 'eq', postId || -1)
      .single();

    if (existingPost) {
      displayMessage('editor-message', 'A post with this slug already exists. Please use a unique slug.', true);
      return;
    }

    let query;
    if (postId) {
      query = supabase
        .from('blogs')
        .update({
          title,
          slug,
          content,
          published: isPublished,
        })
        .eq('id', postId);
    } else {
      query = supabase.from('blogs').insert([
        {
          title: title,
          content: content,
          published: isPublished,
          author_id: user.id,
          slug: slug,
        },
      ]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error saving blog post to Supabase:', error);
      displayMessage(
        'editor-message',
        `Failed to save blog post: ${error.message}`,
        true
      );
    } else {
      displayMessage(
        'editor-message',
        `Blog post ${
          isPublished ? 'published' : 'saved as draft'
        } successfully!`,
        false
      );
      titleInput.value = '';
      slugInput.value = '';
      quill.setContents([]);
      if (postId) {
        redirectTo('/admin/editor.html');
      }
    }
  } catch (unexpectedError) {
    console.error('Unexpected error during blog save:', unexpectedError);
    displayMessage(
      'editor-message',
      'An unexpected error occurred while saving. Please try again.',
      true
    );
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = isPublished ? 'Publish Blog' : 'Save Draft';
  }
}

async function fetchAndDisplayBlogPosts() {
  const blogContainer = document.getElementById('blog-posts-container');

  if (!blogContainer) {
    return;
  }

  blogContainer.innerHTML = `
        <div class="col-span-full p-6 bg-white rounded-lg shadow-md flex items-center justify-center">
            <p class="text-slate-500">Loading blog posts...</p>
        </div>
    `;

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select()
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for frontend:', error);
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-red-500">Failed to load blog posts.</div>';
    return;
  }

  if (blogs.length === 0) {
    blogContainer.innerHTML =
      '<div class="col-span-full text-center py-8 text-slate-500">No blog posts published yet.</div>';
    return;
  }

  blogContainer.innerHTML = '';

  blogs.forEach((blog) => {
    const blogPostLink = document.createElement('a');
    blogPostLink.href = `/post.html?b=${blog.slug}`;
    blogPostLink.classList.add(
      'bg-white',
      'p-6',
      'rounded-lg',
      'shadow-md',
      'block',
      'hover:shadow-xl',
      'transition-shadow'
    );
    blogPostLink.setAttribute('data-aos', 'fade-up');

    const postDate = new Date(blog.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.content;
    const snippet = (tempDiv.textContent || '').substring(0, 120) + '...';

    blogPostLink.innerHTML = `
            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">${blog.title}</h3>
            <p class="text-sm text-slate-500 mb-4">Published on: ${postDate}</p>
            <div class="prose max-w-none text-slate-700 leading-relaxed">${snippet}</div>
        `;
    blogContainer.appendChild(blogPostLink);
  });
  AOS.refresh();
}

async function fetchAndDisplaySinglePost() {
  const postContainer = document.getElementById('single-post-container');
  if (!postContainer) {
    console.error('Single post container not found.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('b');

  if (!slug) {
    postContainer.innerHTML =
      '<p class="text-red-500 text-center">No blog post slug provided.</p>';
    return;
  }

  postContainer.innerHTML =
    '<p class="text-slate-500 text-center">Loading post...</p>';

  const { data: blog, error } = await supabase
    .from('blogs')
    .select()
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !blog) {
    console.error('Error fetching single blog post:', error);
    postContainer.innerHTML =
      '<p class="text-red-500 text-center">Could not find the requested blog post. It may not exist or has not been published.</p>';
    return;
  }

  const postDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  document.title = `${blog.title} - Borderly Visa`;

  postContainer.innerHTML = `
        <h1 class="text-3xl md:text-5xl font-bold text-slate-900 mb-4">${blog.title}</h1>
        <p class="text-md text-slate-500 mb-8">Published on: ${postDate}</p>
        <div class="prose max-w-none text-slate-700 leading-relaxed">${blog.content}</div>
    `;
}

async function initializeCarousel() {
  const container = document.getElementById('carousel');
  if (!container) return;

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select()
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    container.innerHTML = `<p class="text-slate-500">Loading blog posts failed...</p>`;
    return;
  }

  if (blogs && blogs.length === 0) {
    container.innerHTML = `<p class="text-slate-500">No Blogs</p>`;
    return;
  }

  // Clear loading/default state
  container.innerHTML = '';
  AOS.init({
    offset: 120,
    duration: 600,
    easing: 'ease-in-out',
    once: true,
  });

  blogs.forEach((blog) => {
    const blogCard = document.createElement('div');
    blogCard.classList.add(
      'flex-shrink-0',
      'w-80',
      'bg-white',
      'rounded-xl',
      'shadow-lg',
      'overflow-hidden'
    );

    const parseContent = (htmlString) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;

      const imageElement = tempDiv.querySelector('img');
      const imageUrl = imageElement
        ? imageElement.src
        : 'https://placehold.co/600x400/f8fafc/334155?text=Blog+Image';

      const textContent = tempDiv.textContent || '';

      return { imageUrl, textContent };
    };

    const { imageUrl, textContent } = parseContent(blog.content);

    blogCard.innerHTML = `
            <a href="/post.html?b=${blog.slug}" class="block hover:bg-slate-50 transition-colors">
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
            `;
    container.appendChild(blogCard);
  });
}

async function fetchAndDisplayAdminBlogPosts() {
  const container = document.getElementById('blog-list-container');
  if (!container) return;

  const { data: posts, error } = await supabase
    .from('blogs')
    .select('id, title, published')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p class="text-red-500">Failed to load posts.</p>';
    return;
  }

  if (posts.length === 0) {
    container.innerHTML = '<p class="text-slate-500">No posts found.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'w-full text-left border-collapse';
  table.innerHTML = `
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">Title</th>
        <th class="py-2 px-4 border-b">Status</th>
        <th class="py-2 px-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      ${posts
        .map(
          (post) => `
        <tr class="hover:bg-slate-50">
          <td class="py-2 px-4 border-b">${post.title}</td>
          <td class="py-2 px-4 border-b">${post.published ? 'Published' : 'Draft'}</td>
          <td class="py-2 px-4 border-b">
            <a href="/admin/editor.html?id=${post.id}" class="text-blue-600 hover:underline mr-4">Edit</a>
            <button data-post-id="${post.id}" class="text-red-600 hover:underline delete-button">Delete</button>
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  `;

  container.innerHTML = '';
  container.appendChild(table);

  document.querySelectorAll('.delete-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const postId = e.target.dataset.postId;
      deletePost(postId);
    });
  });
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  const { error } = await supabase.from('blogs').delete().eq('id', postId);

  if (error) {
    displayMessage('editor-message', `Failed to delete post: ${error.message}`, true);
  } else {
    displayMessage('editor-message', 'Post deleted successfully.', false);
    fetchAndDisplayAdminBlogPosts();
  }
}

export {
  initializeEditorPage,
  saveBlogPost,
  fetchAndDisplayBlogPosts,
  fetchAndDisplaySinglePost,
  initializeCarousel,
  fetchAndDisplayAdminBlogPosts,
  deletePost,
};

