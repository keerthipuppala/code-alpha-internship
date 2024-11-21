const username = "User1";  // Placeholder username
document.getElementById('username').innerText = username;

function createPost() {
    const content = document.getElementById('post-content').value;
    if (!content) return;
    const post = {
        username: username,
        content: content,
        likes: 0,
        comments: []
    };
    fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('post-content').value = '';
        loadPosts();
    });
}

function loadPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = posts.map(post => `
                <div class="post">
                    <p><strong>${post.username}</strong></p>
                    <p>${post.content}</p>
                    <button onclick="likePost('${post._id}')">Like (${post.likes})</button>
                    <div class="comments">
                        ${post.comments.map(comment => `
                            <div class="comment">
                                <p><strong>${comment.username}</strong>: ${comment.content}</p>
                            </div>
                        `).join('')}
                        <textarea placeholder="Comment" onkeypress="addComment(event, '${post._id}')"></textarea>
                    </div>
                </div>
            `).join('');
        });
}

function likePost(postId) {
    fetch(`/api/posts/${postId}/like`, { method: 'POST' })
        .then(response => response.json())
        .then(data => loadPosts());
}

function addComment(event, postId) {
    if (event.key === 'Enter') {
        const content = event.target.value;
        if (!content) return;
        const comment = { username: username, content: content };
        fetch(`/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })
        .then(response => response.json())
        .then(data => loadPosts());
    }
}

loadPosts();
