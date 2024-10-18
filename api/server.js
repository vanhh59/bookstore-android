const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Khởi tạo Express
const app = express();
dotenv.config();

// Middleware để parse JSON
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Import routes
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
