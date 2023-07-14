import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import UserModel from "./models/User.js";
import PostModel from "./models/Post.js";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const reactURL = process.env.REACTAPP_URL


const app = express();
app.use(cors({ credentials: true, origin: ['http://localhost:5173', "https://blog-hub-ik8s.onrender.com/"] }));
dotenv.config();
const jwt = jsonwebtoken;
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
const uploadMiddleware = multer({ dest: "uploads/" });

mongoose.connect(process.env.MONGODB_URL);

await mongoose.connect(process.env.MONGODB_URL);

//bcrypt
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_TOKEN;
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userDoc = await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userdoc = await UserModel.findOne({ username });
  const passOk = bcrypt.compareSync(password, userdoc.password);
  if (passOk) {
    // keep user logged in
    jwt.sign({ username, id: userdoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userdoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong Password!");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").status(400).json("ok");
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const splice = originalname.split("."); //split the filename at . so we can get the extension
  const ext = splice[splice.length - 1];
  const photoPath = path + "." + ext;
  fs.renameSync(path, path + "." + ext);
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      photo: photoPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(await PostModel.find().populate("author", "username").sort({createdAt: -1}).limit(10));
});

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  let photoPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const splice = originalname.split(".");
    const ext = splice[splice.length - 1];
    photoPath = path + "." + ext;
    fs.renameSync(path, path + "." + ext);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postId = req.params.id;

    const postDoc = await PostModel.findById(postId);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json("Invalid Author");
    }

    await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          title,
          summary,
          content,
          photo: photoPath ? photoPath : postDoc.photo,
        },
      },
      { new: true }
    );

    const updatedPost = await PostModel.findById(postId);

    res.json(updatedPost);
  });
});



app.get('/post/:id', async(req,res)=>{
  const {id} = req.params
  const postDoc = await PostModel.findById(id).populate('author', 'username')
  res.json(postDoc)
})

app.listen(4000);
