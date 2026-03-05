const aroutes = require("./routes/aroutes");
const profileroutes = require("./routes/profileroutes");
const bookingroutes=require("./routes/bookingroutes");
const portfolioroutes = require("./routes/portfolioroutes");
const reviewroutes = require("./routes/reviewroutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",aroutes);
app.use("/api/profiles", profileroutes);
app.use("/api/bookings",bookingroutes);
app.use("/api/portfolio", portfolioroutes);
app.use("/api/reviews", reviewroutes);
app.get("/", (req, res) => {
  res.send("Backend connected");
});
mongoose.connect("mongodb+srv://zaheemm550:50AifBpuS8HFFSUu@cluster0.jdtvara.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});