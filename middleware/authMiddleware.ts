import jwt, {
  JsonWebTokenError,
  VerifyCallback,
  VerifyErrors,
} from "jsonwebtoken";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies._at;

  if (token) {
    jwt.verify(
      token,
      "smart people read the star",
      (err: VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          res.redirect("/login");
        } else {
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies._at;

  if (token) {
    jwt.verify(
      token,
      "smart people read the star",
      async (err: VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          res.locals.user = null;
          next();
        } else if (decoded) {
          // @ts-ignore
          let user = await User.findById(decoded.id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

export { requireAuth, checkUser };
