const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
// const dbURI = "mongodb://localhost:27017/node-auth";
const dbURI = "mongodb+srv://vansoundz:$D011ar$@test.zkqsl.mongodb.net/nauth";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(PORT))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));

app.use(authRoutes);
