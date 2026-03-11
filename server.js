require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aroutes = require("./routes/aroutes");
const profileroutes = require("./routes/profileroutes");
const bookingroutes = require("./routes/bookingroutes");
const portfolioroutes = require("./routes/portfolioroutes");
const reviewroutes = require("./routes/reviewroutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", aroutes);
app.use("/api/profiles", profileroutes);
app.use("/api/bookings", bookingroutes);
app.use("/api/portfolio", portfolioroutes);
app.use("/api/reviews", reviewroutes);

app.get("/", (req, res) => res.send("Backend connected"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});