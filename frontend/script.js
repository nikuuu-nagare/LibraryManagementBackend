const API = "https://librarymanagementbackend-api.onrender.com";

// =========================
// Section Navigation
// =========================

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

    if (sectionId === "dashboard") loadDashboard();
    if (sectionId === "books") loadBooks();
    if (sectionId === "members") loadMembers();
    if (sectionId === "authors") loadAuthors();
    if (sectionId === "history") loadHistory();
}


// =========================
// Dashboard
// =========================

async function loadDashboard() {
    try {
        const books = await fetch(`${API}/books`).then(res => res.json());
        const members = await fetch(`${API}/members`).then(res => res.json());
        const authors = await fetch(`${API}/authors`).then(res => res.json());
        const history = await fetch(`${API}/borrowing-history`).then(res => res.json());

        document.getElementById("bookCount").textContent = books.total;
        document.getElementById("memberCount").textContent = members.totalMembers;
        document.getElementById("authorCount").textContent = authors.length;
        document.getElementById("issuedCount").textContent = history.total;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


// =========================
// Books
// =========================

async function loadBooks() {
    try {
        const search = document.getElementById("bookSearch").value;
        const available = document.getElementById("bookAvailability").value;

        let url = `${API}/books?`;

        if (search) {
            url += `search=${encodeURIComponent(search)}&`;
        }

        if (available !== "") {
            url += `available=${available}&`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const table = document.getElementById("booksTable");

        table.innerHTML = "";

        data.books.forEach(book => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>

                <td>
                    ${
                        book.available
                        ? '<span class="status-available">Available</span>'
                        : '<span class="status-issued">Issued</span>'
                    }
                </td>

                <td>
                    ${
                        book.available
                        ?
                        `<button class="action-btn issue-btn"
                            onclick="issueBook(${book.id})">
                            Issue
                        </button>`
                        :
                        `<button class="action-btn return-btn"
                            onclick="returnBook(${book.id})">
                            Return
                        </button>`
                    }

                    <button class="action-btn delete-btn"
                        onclick="deleteBook(${book.id})">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Books error:", error);
    }
}


// =========================
// Add Book
// =========================

function openBookForm() {
    document.getElementById("bookForm").classList.remove("hidden");
}

function closeBookForm() {
    document.getElementById("bookForm").classList.add("hidden");
}

async function addBook() {

    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const isbn = document.getElementById("bookISBN").value;

    if (!title || !author || !isbn) {
        alert("Please fill all book fields");
        return;
    }

    try {

        const response = await fetch(`${API}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                author,
                isbn
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Book added successfully!");

        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";
        document.getElementById("bookISBN").value = "";

        closeBookForm();

        loadBooks();
        loadDashboard();

    } catch (error) {
        alert("Backend connection failed");
        console.error(error);
    }
}


// =========================
// Delete Book
// =========================

async function deleteBook(id) {

    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {

        const response = await fetch(`${API}/books/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        loadBooks();
        loadDashboard();

    } catch (error) {
        console.error(error);
    }
}


// =========================
// Issue Book
// =========================

let selectedBookId = null;


// =========================
// Open Issue Book Modal
// =========================

function issueBook(bookId) {

    selectedBookId = bookId;

    document.getElementById("issueMemberId").value = "";

    document.getElementById("issueModal").classList.remove("hidden");

}


// =========================
// Confirm Issue Book
// =========================

async function confirmIssueBook() {

    const memberId =
        document.getElementById("issueMemberId").value;

    if (!memberId) {
        alert("Please enter Member ID");
        return;
    }

    try {

        const response = await fetch(
            `${API}/books/${selectedBookId}/issue`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    memberId: parseInt(memberId)
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        closeIssueModal();

        loadBooks();
        loadHistory();
        loadDashboard();

    } catch (error) {

        console.error(error);
        alert("Something went wrong");

    }
}


// =========================
// Close Issue Modal
// =========================

function closeIssueModal() {

    document
        .getElementById("issueModal")
        .classList.add("hidden");

    selectedBookId = null;

}

// =========================
// Return Book
// =========================

async function returnBook(bookId) {

    try {

        const response = await fetch(`${API}/books/${bookId}/return`, {
            method: "PUT"
        });

        const data = await response.json();

        alert(data.message);

        loadBooks();
        loadHistory();
        loadDashboard();

    } catch (error) {
        console.error(error);
    }
}


// =========================
// Members
// =========================

async function loadMembers() {

    try {

        const search =
            document.getElementById("memberSearch").value;

        const membershipType =
            document.getElementById("membershipFilter").value;

        let url = `${API}/members?`;

        if (search) {
            url += `search=${encodeURIComponent(search)}&`;
        }

        if (membershipType) {
            url += `membershipType=${encodeURIComponent(membershipType)}&`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const table =
            document.getElementById("membersTable");

        table.innerHTML = "";

        data.members.forEach(member => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.membershipType || "-"}</td>

                <td>
                    <button class="action-btn delete-btn"
                        onclick="deleteMember(${member.id})">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Members error:", error);
    }
}


// =========================
// Add Member
// =========================

function openMemberForm() {
    document.getElementById("memberForm").classList.remove("hidden");
}

function closeMemberForm() {
    document.getElementById("memberForm").classList.add("hidden");
}

async function addMember() {

    const name =
        document.getElementById("memberName").value;

    const email =
        document.getElementById("memberEmail").value;

    const phone =
        document.getElementById("memberPhone").value;

    const membershipType =
        document.getElementById("memberType").value;

    if (!name || !email || !phone || !membershipType) {
        alert("Please fill all member fields");
        return;
    }

    try {

        const response = await fetch(`${API}/members`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                membershipType
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Member added successfully!");

        document.getElementById("memberName").value = "";
        document.getElementById("memberEmail").value = "";
        document.getElementById("memberPhone").value = "";
        document.getElementById("memberType").value = "";

        closeMemberForm();

        loadMembers();
        loadDashboard();

    } catch (error) {
        alert("Backend connection failed");
        console.error(error);
    }
}


// =========================
// Delete Member
// =========================

async function deleteMember(id) {

    if (!confirm("Are you sure you want to delete this member?")) {
        return;
    }

    try {

        const response =
            await fetch(`${API}/members/${id}`, {
                method: "DELETE"
            });

        const data = await response.json();

        alert(data.message);

        loadMembers();
        loadDashboard();

    } catch (error) {
        console.error(error);
    }
}


// =========================
// Authors
// =========================

async function loadAuthors() {

    try {

        const response =
            await fetch(`${API}/authors`);

        const authors = await response.json();

        const table =
            document.getElementById("authorsTable");

        table.innerHTML = "";

        authors.forEach(author => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${author.id}</td>
                <td>${author.name}</td>
                <td>${author.email}</td>

                <td>
                    <button class="action-btn delete-btn"
                        onclick="deleteAuthor(${author.id})">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Authors error:", error);
    }
}


// =========================
// Add Author
// =========================

function openAuthorForm() {
    document.getElementById("authorForm").classList.remove("hidden");
}

function closeAuthorForm() {
    document.getElementById("authorForm").classList.add("hidden");
}

async function addAuthor() {

    const name =
        document.getElementById("authorName").value;

    const email =
        document.getElementById("authorEmail").value;

    if (!name || !email) {
        alert("Please fill all author fields");
        return;
    }

    try {

        const response = await fetch(`${API}/authors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Author added successfully!");

        document.getElementById("authorName").value = "";
        document.getElementById("authorEmail").value = "";

        closeAuthorForm();

        loadAuthors();
        loadDashboard();

    } catch (error) {
        alert("Backend connection failed");
        console.error(error);
    }
}


// =========================
// Delete Author
// =========================

async function deleteAuthor(id) {

    if (!confirm("Are you sure you want to delete this author?")) {
        return;
    }

    try {

        const response =
            await fetch(`${API}/authors/${id}`, {
                method: "DELETE"
            });

        const data = await response.json();

        alert(data.message);

        loadAuthors();
        loadDashboard();

    } catch (error) {
        console.error(error);
    }
}


// =========================
// Borrowing History
// =========================

async function loadHistory() {

    try {

        const response =
            await fetch(`${API}/borrowing-history`);

        const data = await response.json();

        const table =
            document.getElementById("historyTable");

        table.innerHTML = "";

        data.history.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.bookTitle}</td>
                <td>${item.memberName}</td>
                <td>${formatDate(item.issuedAt)}</td>
                <td>
                    ${
                        item.returnedAt
                        ? formatDate(item.returnedAt)
                        : "Not Returned"
                    }
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("History error:", error);
    }
}


// =========================
// Date Formatting
// =========================

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
}


// =========================
// Initial Load
// =========================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});