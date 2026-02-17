const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Disable mongoose buffering (CRITICAL for Render free tier)
mongoose.set("bufferCommands", false);

// Test route
app.get("/", (req, res) => {
  res.send("Developer Hub API Running 🚀");
});

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Error handler
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB → then start server
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // fail fast
  })
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });
