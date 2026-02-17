const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Developer Hub API Running 🚀");
});

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Error handler middleware (must be after routes)
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

// Start server ONLY after DB connects
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Stop app if DB fails
  });
