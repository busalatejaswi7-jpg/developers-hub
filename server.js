const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Developer Hub API Running 🚀");
});



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("Mongo Error:", err));

const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);



const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);



















app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
