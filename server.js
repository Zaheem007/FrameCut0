require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aroutes = require("./routes/aroutes");
const profileroutes = require("./routes/profileroutes");
const bookingroutes = require("./routes/bookingroutes");
const portfolioroutes = require("./routes/portfolioroutes");
const reviewroutes = require("./routes/reviewroutes");
const paymentRoutes = require("./routes/paymentroutes");


const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", aroutes);
app.use("/api/profiles", profileroutes);
app.use("/api/bookings", bookingroutes);
app.use("/api/portfolio", portfolioroutes);
app.use("/api/reviews", reviewroutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("Backend connected"));

const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new Error("MONGO_URI and JWT_SECRET must be configured");
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exitCode = 1;
  });