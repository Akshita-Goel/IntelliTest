const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");
const fs = require('fs');
const PDFDocument = require('pdfkit');

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));

app.set("view engine", "hbs");
app.set("views", templatePath);

// Render results button page
app.get("/resultsbtn", (req, res) => {
    const username = req.query.username;
    res.render("resultsbtn", { username });
});

// Register Handlebars helper function
hbs.registerHelper('formatDate', function(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options); // Change 'en-GB' to your desired locale
});

// Render login page
app.get("/", (req, res) => {
    res.render("login");
});

// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    await collection.insertMany([data]);
    res.render("login");
});

// Handle login form submission
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name, email: req.body.email });
        if (check.password === req.body.password) {
            res.render("dashboard", { username: req.body.name });
        } else {
            res.send("Wrong password");
        }
    } catch {
        res.send("Wrong details");
    }
});

// Render dashboard page
app.get("/dashboard", (req, res) => {
    const username = req.query.username;
    res.render("dashboard", { username });
});

// POST endpoint to save quiz results
app.post("/save-result", async (req, res) => {
    const { username, scoreattention } = req.body;

    try {
        const user = await collection.findOneAndUpdate(
            { name: username },
            { $push: { results: { date: new Date(), scoreattention } } },
            { new: true }
        );

        if (!user) {
            console.log(`User '${username}' not found in database`);
            return res.status(404).send("User not found");
        }

        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).send("Error saving result");
    }
});

// GET endpoint to retrieve results
app.get("/Attentionresults", async (req, res) => {
    const username = req.query.username;

    try {
        const user = await collection.findOne({ name: username });

        if (!user) {
            console.log(`User '${username}' not found in database`);
            return res.status(404).send("User not found");
        }

        res.render("Attentionresults", { results: user.results, username });
    } catch (error) {
        console.error("Error retrieving results:", error);
        res.status(500).send("Error retrieving results");
    }
});


// Route to download results as PDF
app.get('/download-results-pdf', async (req, res) => {
    const username = req.query.username;

    try {
        const user = await collection.findOne({ name: username });

        if (!user) {
            console.log(`User '${username}' not found in database`);
            return res.status(404).send("User not found");
        }

        // Create a new PDF document
        const doc = new PDFDocument();
        const filename = `${username}_results.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe PDF data to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Quiz Results', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Username: ${username}`, { align: 'left' });
        doc.moveDown();

        // Add a header for the table
        doc.fontSize(12).text('Date', { continued: true }).text('          Score'); // Adjust space here
        doc.moveDown();

        // Add results
        user.results.forEach(result => {
            doc.fontSize(12).text(new Date(result.date).toLocaleDateString('en-GB'), { continued: true })
               .text('          ' + result.scoreattention);  // Adjust space here
            doc.moveDown();
        });

        // Finalize PDF file
        doc.end();
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    }
});

// Handle home page
app.get("/index.html", (req, res) => {
    res.redirect("http://localhost:3000");
});

// Handle user logout
app.get("/logout", (req, res) => {
    res.redirect("/");
});

// Serve AttentionTest directory as static content
app.use('/Attention', express.static(path.join(__dirname, '../Attention')));

// Serve AttentionTest index.html
app.get('/Attention', (req, res) => {
    res.sendFile(path.join(__dirname, '../Attention/index.html'));
});

// Serve AttentionTest directory as static content
app.use('/Attentionresults', express.static(path.join(__dirname, '../Attentionresults')));

// Serve AttentionTest index.html
app.get('/Attentionresults', (req, res) => {
    res.sendFile(path.join(__dirname, '../Attentionresults/index.html'));
});


const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
