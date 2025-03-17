const mongoose = require("mongoose");

// Connect to the database
mongoose.connect("mongodb://localhost:27017/ResilienceLogInSignUp")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed to connect");
    });

// Define the schema
const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    results: [{
        scoreresilience: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

const collection = new mongoose.model("LogInConnection", LogInSchema);

module.exports = collection;