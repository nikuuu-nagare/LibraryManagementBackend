const express = require("express");

const app = express();

app.use(express.json());

const books = [];
const borrowingHistory = [];
const members = [];
const authors = [];


// Add Book
app.post("/books", (req, res) => {
    
    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
        return res.status(400).json({
            message: "Title, author and ISBN are required"
        });
    }

    const book = {
        id: books.length + 1,
        title,
        author,
        isbn,
        available: true
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book: book
    });
});

// Test Route
app.get("/test-search", (req, res) => {
    res.json({
        message: "NEW CODE IS RUNNING"
    });
});

// Get All Books
// Get All Books - Search, Filter, Pagination
app.get("/books", (req, res) => {
    let result = [...books];

    // Search
    if (req.query.search) {
        const search = req.query.search.toLowerCase();

        result = result.filter(book =>
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search) ||
            book.isbn.toString().includes(search)
        );
    }

    // Filter by availability
    if (req.query.available !== undefined) {
        const available = req.query.available === "true";

        result = result.filter(book =>
            book.available === available
        );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const start = (page - 1) * limit;

    const paginatedBooks = result.slice(start, start + limit);

    res.status(200).json({
        total: result.length,
        page: page,
        limit: limit,
        books: paginatedBooks
    });
});

// Add Member
app.post("/members", (req, res) => {
   const { name, email, phone, membershipType } = req.body;

   if (!name || !email || !phone || !membershipType) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    const member = {
    id: members.length + 1,
    name,
    email,
    phone,
    membershipType
};

    members.push(member);

    res.status(201).json({
        message: "Member added successfully",
        member: member
    });
});

//All Get Members
app.get("/members", (req, res) => {
    let result = [...members];

    // Search by name
    if (req.query.search) {
        const search = req.query.search.toLowerCase();

        result = result.filter(member =>
            member.name.toLowerCase().includes(search)
        );
    }


    // Filter by membership type
if (req.query.membershipType) {
    const membershipType = String(req.query.membershipType).toLowerCase();

    result = result.filter(member =>
        String(member.membershipType || "").toLowerCase() === membershipType
    );
}

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedMembers = result.slice(startIndex, endIndex);

    res.status(200).json({
        totalMembers: result.length,
        page: page,
        limit: limit,
        members: paginatedMembers
    });
});

// Update Member
app.put("/members/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const member = members.find(m => m.id === id);

    if (!member) {
        return res.status(404).json({
            message: "Member not found"
        });
    }

    const { name, email, phone, membershipType } = req.body;

   if (!name || !email || !phone || !membershipType) {
        return res.status(400).json({
            message: "Name, email and phone are required"
        });
    }

    member.name = name;
    member.email = email;
    member.phone = phone;
    member.membershipType = membershipType;

    res.status(200).json({
        message: "Member updated successfully",
        member: member
    });
});

// Delete Member
app.delete("/members/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = members.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Member not found"
        });
    }

    const deletedMember = members.splice(index, 1)[0];

    res.status(200).json({
        message: "Member deleted successfully",
        member: deletedMember
    });
});

// Add Author
console.log("AUTHOR ROUTE LOADED");

app.post("/authors", (req, res) => {
    console.log("AUTHOR REQUEST RECEIVED");

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const author = {
        id: authors.length + 1,
        name: name,
        email: email
    };

    authors.push(author);

    res.status(201).json({
        message: "Author added successfully",
        author: author
    });
});

// Get All Authors
app.get("/authors", (req, res) => {
    res.status(200).json(authors);
});
// Update Author
app.put("/authors/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const author = authors.find(a => a.id === id);

    if (!author) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    author.name = name;
    author.email = email;

    res.status(200).json({
        message: "Author updated successfully",
        author: author
    });
});

// Delete Author
app.delete("/authors/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = authors.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Author not found"
        });
    }

    const deletedAuthor = authors.splice(index, 1)[0];

    res.status(200).json({
        message: "Author deleted successfully",
        author: deletedAuthor
    });
});

// Update Book
console.log("PUT ROUTE LOADED");

app.put("/books/:id", (req, res) => {
    console.log("PUT REQUEST RECEIVED");
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
        return res.status(400).json({
            message: "Title, author and ISBN are required"
        });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});

 // Issue Book
console.log("ISSUE ROUTE LOADED");

app.put("/books/:id/issue", (req, res) => {
    console.log("ISSUE REQUEST RECEIVED");

    const id = parseInt(req.params.id);
    const { memberId } = req.body;

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!memberId) {
        return res.status(400).json({
            message: "Member ID is required"
        });
    }

    const member = members.find(m => m.id === parseInt(memberId));

    if (!member) {
        return res.status(404).json({
            message: "Member not found"
        });
    }

    if (!book.available) {
        return res.status(400).json({
            message: "Book is already issued"
        });
    }

    book.available = false;

    const history = {
        id: borrowingHistory.length + 1,
        bookId: book.id,
        bookTitle: book.title,
        memberId: member.id,
        memberName: member.name,
        issuedAt: new Date().toISOString(),
        returnedAt: null
    };

    borrowingHistory.push(history);

    res.status(200).json({
        message: "Book issued successfully",
        book: book,
        borrowing: history
    });
});

// Get Borrowing History
app.get("/borrowing-history", (req, res) => {
    res.status(200).json({
        total: borrowingHistory.length,
        history: borrowingHistory
    });
});

// Return Book
console.log("RETURN ROUTE LOADED");

app.put("/books/:id/return", (req, res) => {
    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available) {
        return res.status(400).json({
            message: "Book is already available"
        });
    }

    book.available = true;

const historyIndex = borrowingHistory
    .map((h, index) => ({ h, index }))
    .reverse()
    .find(item =>
        item.h.bookId === book.id &&
        item.h.returnedAt === null
    );

if (historyIndex) {
    borrowingHistory[historyIndex.index].returnedAt =
        new Date().toISOString();
}

console.log("RETURN HISTORY UPDATED:", borrowingHistory);

res.status(200).json({
    message: "Book returned successfully",
    book: book,
    borrowingHistory: borrowingHistory
});
});

// Delete Book
app.delete("/books/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Home
app.get("/", (req, res) => {
    res.send("Library Management Backend is running!");
});


// History Test
app.get("/history-test", (req, res) => {
    res.json({
        message: "HISTORY ROUTE IS WORKING"
    });
});
// Server

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});