import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
const options = {discriminatorKey: "Kind", timestamps: true};
import * as er from "../helperclasses/errors";
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
  passwordResetToken: string;
  passwordResetExpires: Date;

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
  validateFName: (fName: string, erObj: er.ErrorArray, cb: (err: any) => {}) => {};
}

export type AuthToken = {
  accessToken: string,
  kind: string
};

export const userSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  school: String,
  password: String,
  pNumber: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
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
userSchema.methods.validateFName = function (fName: string, cb: (err: any, erObj1: er.ErrorMessage) => {}) {
  if (fName && !validator.isAlpha(fName)) {
    const erObj1: er.ErrorMessage = new er.ErrorMessage("Please use only letters for first name", "fName", fName);
    return erObj1;
  }
  return undefined;
};
userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
export const User = mongoose.model("User", userSchema);
export default User;

