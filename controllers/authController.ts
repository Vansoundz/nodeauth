import { User } from "../models/User";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id: string) => {
  return jwt.sign({ id }, "smart people read the star", { expiresIn: maxAge });
};

module.exports.signup_get = (req: Request, res: Response) => {
  res.render("signup");
};

module.exports.login_get = (req: Request, res: Response) => {
  res.render("login");
};

module.exports.signup_post = async (req: Request, res: Response) => {
  const errs = validationResult(req);
  const { email, password } = req.body;

  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  let user;
  await User.findOne({ email }, (err, usr) => {
    if (!err) {
      user = usr;
    }
  });

  if (user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Email already taken",
          param: "email",
        },
      ],
    });
  }

  user = await User.create({ email, password });
  const token = createToken(user._id);
  res.cookie("_at", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(201).json({ user: user._id });
};

module.exports.login_post = async (req: Request, res: Response) => {
  const errs = validationResult(req);
  const { email, password } = req.body;
  if (!errs.isEmpty()) {
    return res.status(400).json({ errors: errs.array() });
  }
  try {
    // @ts-ignore
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("_at", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  } catch (error) {
    let err;
    if (error.message.includes("email")) {
      err = [
        {
          msg: "Email not registered",
          param: "email",
        },
      ];
    } else {
      err = [
        {
          msg: "Incorrect password",
          param: "password",
        },
      ];
    }
    res.status(400).json({ errors: err });
  }
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

module.exports.logout_get = (req: Request, res: Response) => {
  res.cookie("_at", "", { maxAge: 1 });
  res.redirect("/");
};
