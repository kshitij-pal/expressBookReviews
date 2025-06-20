const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "john_doe", password: "pass123" },
  { username: "kshitij_pal", password: "pass456" }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  // A valid username should be a string with at least 3 characters 
  return typeof username === 'string' && username.length >= 3;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // Check if the user exists in the users array
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if a valid user is found, otherwise false
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username"});
  }
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt
      .sign
      ({ data: password }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    };
    // Respond with success message and token
    return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  });
  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({message: "Username and review are required"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added successfully", reviews: books[isbn].reviews});

});

// Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract ISBN from route parameters
  const isbn = req.params.isbn;

  // Retrieve the username from the session (set during login)
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if there are any reviews for this book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user to delete" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
