const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Lấy danh sách tất cả các sách
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một cuốn sách theo ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm một cuốn sách mới
router.post('/', async (req, res) => {
    const { title, author, description, publishedYear, price, stock } = req.body;

    const book = new Book({
        title,
        author,
        description,
        publishedYear,
        price,
        stock
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin sách
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const { title, author, description, publishedYear, price, stock } = req.body;

        if (title) book.title = title;
        if (author) book.author = author;
        if (description) book.description = description;
        if (publishedYear) book.publishedYear = publishedYear;
        if (price) book.price = price;
        if (stock) book.stock = stock;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sách
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await book.remove();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tìm kiếm sách theo tiêu chí
router.get('/search', async (req, res) => {
    try {
        // Lấy các tiêu chí tìm kiếm từ query string
        const { title, author, publishedYear } = req.query;

        // Tạo đối tượng query tìm kiếm
        let query = {};

        // Nếu có tiêu chí tìm kiếm, thêm vào đối tượng query
        if (title) {
            query.title = { $regex: title, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }
        if (author) {
            query.author = { $regex: author, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }
        if (publishedYear) {
            query.publishedYear = publishedYear;
        }

        // Tìm kiếm sách dựa trên tiêu chí
        const books = await Book.find(query);

        // Trả về kết quả
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria.' });
        }

        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;
