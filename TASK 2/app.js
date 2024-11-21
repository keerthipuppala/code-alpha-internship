const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/socialmedia', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User and Post models
const userSchema = new mongoose.Schema({ username: String });
const postSchema = new mongoose.Schema({
    username: String,
    content: String,
    likes: Number,
    comments: [{ username: String, content: String }]
});
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Seed some users
const users = [{ username: 'User1' }, { username: 'User2' }];
User.insertMany(users, (err) => {
    if (err) console.log(err);
});

// API to create a post
app.post('/api/posts', (req, res) => {
    const post = new Post(req.body);
    post.save((err, post) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(post);
    });
});

// API to get all posts
app.get('/api/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(posts);
    });
});

// API to like a post
app.post('/api/posts/:id/like', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) return res.status(500).send(err);
        post.likes += 1;
        post.save((err, updatedPost) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(updatedPost);
        });
    });
});

// API to add a comment
app.post('/api/posts/:id/comment', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) return res.status(500).send(err);
        post.comments.push(req.body);
        post.save((err, updatedPost) => {
            if (err) return res.status(500).send(err);
            res.status(200).send(updatedPost);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
