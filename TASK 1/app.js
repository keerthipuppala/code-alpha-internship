const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Product model
const Product = mongoose.model('Product', { name: String, price: Number });

// Seed some products
const products = [
    { name: 'Product 1', price: 10 },
    { name: 'Product 2', price: 20 },
    { name: 'Product 3', price: 30 },
];

Product.insertMany(products, (err) => {
    if (err) console.log(err);
    else console.log('Products seeded');
});

// Serve static files
app.use(express.static('public'));

// API to get products
app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) res.status(500).send(err);
        else res.json(products);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
