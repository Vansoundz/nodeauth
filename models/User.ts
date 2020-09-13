import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { HookNextFunction } from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "6+ characters"],
  },
});

userSchema.pre("save", async function (this: any, next: HookNextFunction) {
  const salt = await bcrypt.genSalt();
  this.password! = await bcrypt.hash(this.password!, salt);
  next();
});

userSchema.statics.login = async function (email: string, password: string) {
  const user = await this.findOne({ email });
  if (user) {
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("user", userSchema);

export { User };
