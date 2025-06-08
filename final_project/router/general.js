const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users[username]) {
    return res.status(400).json({message: "User already exists"});
  } 
  users[username] = { username, password };
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookList = JSON.stringify(books, null, 4);
  return res.status(200).send(bookList);
});

// Async call using Axios (even though we're calling the same server above)
public_users.get('/async-books', async function (req, res) {
  try {
    // Simulating an external request to the same server
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//========================================================================================

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

 // Get book details based on ISBN using async-await
 public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Simulating an external request to the same server
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

//=======================================================================================
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({message: "No books found by this author"});
});

//Get book details based on Author using  async-await 
public_users.get('/async-author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Simulating an external request to the same server
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

//======================================================================================
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title); 
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }
  return res.status(404).json({message: "No books found with this title"});
});

//Get book details based on Title using async-await
public_users.get('/async-title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Simulating an external request to the same server
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//======================================================================================
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;
