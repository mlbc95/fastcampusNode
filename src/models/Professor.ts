import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import { User } from "./User";
const options = {discriminatorKey: "Kind", timestamps: true};

export type ProfessorModel = mongoose.Document & {
    fName: string,
    lName: string,
    email: string,
    username: string,
    school: string,
    password: string,
    pNumber: string,
    courses: Course[],
    passwordResetToken: string,
    passwordResetExpires: Date,

    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
    gravatar: (size: number) => string
  };

  export type Course = {
    number: number,
    name: string,
    crnNumber: number,
    section: string,
    startTime: number,
    endTime: number,
  };