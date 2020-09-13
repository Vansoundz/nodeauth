// const express = require("express");
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/auth");
const app = express();

config();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
// const dbURI = "mongodb://localhost:27017/node-auth";
// const dbURI = "mongodb+srv://vansoundz:$D011ar$@test.zkqsl.mongodb.net/nauth";

const PORT = process.env.PORT || 3000;

console.log(process.env.URI);

mongoose
  .connect(process.env.URI!, {
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
