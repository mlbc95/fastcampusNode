import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
const options = {discriminatorKey: "role", timestamps: true};
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
export interface UserModel extends mongoose.Document {
  fName: string;
  lName: string;
  email: string;
  username: string;
  school: string;
  password: string;
  pNumber: string;
  courses: Course[];
  passwordResetToken: string;
  passwordResetExpires: Date;
  lastLogin: Date;

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
}

export type AuthToken = {
  accessToken: string,
  kind: string
};
export type Course = {
  number: number,
  name: string,
  crnNumber: number,
  section: string,
  startTime: number,
  endTime: number,
  professor: string[]
};
export const userSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  school: String,
  password: String,
  pNumber: String,
  courses: Array,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
}, options);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});
userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

export const User = mongoose.model("User", userSchema);
export default User;

