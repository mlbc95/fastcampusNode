import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
const typeCheck = require("type-check").typeCheck;
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
import { ErrorArray, ErrorMessage } from "../helperclasses/errors";
const request = require("express-validator");
// Custom classes




/**
 * POST /account/profile
 * Update profile information.
 */
export let postUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  // Create array object we can push on for custom error messages
  const erArray: ErrorArray = new ErrorArray();

  // Validation of inputs
  if (req.body.fName && !validator.isAlpha(req.body.fName)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use only letters for first name", "fName", req.body.fName);
    erArray.errors.push(erObj);
  }
  if (req.body.lName && !validator.isAlpha(req.body.lName)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use only letters for last name", "fName", req.body.lName);
    erArray.errors.push(erObj);
  }
  if (req.body.email && !validator.isEmail(req.body.email)) {
    const erObj: ErrorMessage = new ErrorMessage("Please use a valid email address", "eamil", req.body.email);
    erArray.errors.push(erObj);
  }
  const schoolRegex = /[A-Za-z ]*/;
  if (req.body.school && !schoolRegex.test(req.body.school)) {
    const erObj: ErrorMessage = new ErrorMessage("Please enter a valid school name", "school", req.body.school);
    erArray.errors.push(erObj);
  }
  const phoneRegex = /\d{10,12}/;
  if (req.body.pNumber && !phoneRegex.test(req.body.pNumber)) {
    const erObj: ErrorMessage = new ErrorMessage("Please enter a valid phone number", "pNumber", req.body.pNumber);
    erArray.errors.push(erObj);
  }

  // Create counter for our array
  let x: number = 0;

  // Loop through the degrees and add error message onto our array if degrees are present
  if (req.body.degrees) {
    lodash.forEach(req.body.degrees, function (value: Degree) {
      console.log(value);

      // If the level is not characters error out
      if (!validator.isAlpha(value.level)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for level", "degrees.level[" + x + "]", value.level);
        erArray.errors.push(erObj);
      }

      // If the name is not characters error out
      if (!validator.isAlpha(value.name)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for name", "degrees.name[" + x + "]", value.name);
        erArray.errors.push(erObj);
      }
      // Increase our array counter
      x++;
    });
  }


  // Reset array counter
  x = 0;

  // Loop through courses and validate them if present
  if (req.body.courses) {
    lodash.forEach(req.body.courses, function (value: Course) {
      if (!typeCheck("Number", value.number)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for course number", "courses.number[" + x + "]", value.number);
        erArray.errors.push(erObj);
      }
      const nameRegex = /[A-Za-z ]*/;
      if (!nameRegex.test(value.name)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only letters and spaces for course name", "courses.name[" + x + "]", value.name);
        erArray.errors.push(erObj);
      }
      if (!typeCheck("Number", value.crnNumber)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for crnNumber", "courses.crnNumber[" + x + "]", value.crnNumber);
        erArray.errors.push(erObj);
      }
      // This needs to be stricter regex
      if (!validator.isAlphanumeric(value.section)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only numbers and letters for section", "courses.section[" + x + "]", value.section);
        erArray.errors.push(erObj);
      }
      if (!typeCheck("Number", value.startTime)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for start time", "courses.startTime[" + x + "]", value.startTime);
        erArray.errors.push(erObj);
      }
      if (!typeCheck("Number", value.endTime)) {
        const erObj: ErrorMessage = new ErrorMessage("Please use only numbers for end time", "courses.endTime[" + x + "]", value.endTime);
        erArray.errors.push(erObj);
      }
      let y = 0;
      lodash.forEach(value.professor, function (val: string){
        // Needs stricter regex
        if (!validator.isAlpha(val)) {
          const erObj: ErrorMessage = new ErrorMessage("Please use only letters professor", "courses.professor[" + x + "][" + y + "]", val);
          erArray.errors.push(erObj);
        }
        y++;
      });
    });
  }

  console.log(erArray.errors);
  // If we got errors error out and return to client
  if (!lodash.isEmpty(erArray.errors)) {
    req.flash("errors", erArray);
    return res.status(400).json({msg: "Data did not pass validation", err: erArray.errors, data: req.body});
  }

  User.findById(req.body.id, (err, user: UserModel) => {
    // Handle Error
    if (err) { return next(err); }
    // Set objects that are present
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.fName) {
      user.fName = req.body.fName;
    }
    if (req.body.lName) {
      user.lName = req.body.lName;
    }
    if (req.body.school) {
      user.school = req.body.school;
    }
    if (req.body.pNumber) {
      user.pNumber = req.body.pNumber;
    }
    if (req.body.degrees) {
      user.degrees = req.body.degrees;
    }
    if (req.body.courses) {
      user.courses = req.body.courses;
    }
    user.save((err: WriteError) => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
          res.json({msg: "The email address you have entered is already associated with an account."});
        }
        return res.status(400).json({err: err});
      }
      req.flash("success", { msg: "Profile information has been updated." });
      res.json({user: user});
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
export let postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) { return next(err); }
      req.flash("success", { msg: "Password has been changed." });
      res.redirect("/account");
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export let postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash("info", { msg: "Your account has been deleted." });
    res.redirect("/");
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export let getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires").gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("errors", { msg: "Password reset token is invalid or has expired." });
        return res.redirect("/forgot");
      }
      res.render("account/reset", {
        title: "Password Reset"
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export let postReset = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long.").len({ min: 4 });
  req.assert("confirm", "Passwords must match.").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("back");
  }

  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user: any) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.redirect("back");
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    function sendResetPasswordEmail(user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: "express-ts@starter.com",
        subject: "Your password has been changed",
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash("success", { msg: "Success! Your password has been changed." });
        done(err);
      });
    }
  ], (err) => {
    if (err) { return next(err); }
    res.redirect("/");
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Please enter a valid email address.").isEmail();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/forgot");
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString("hex");
        done(err, token);
      });
    },
    function setRandomToken(token: AuthToken, done: Function) {
      User.findOne({ email: req.body.email }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
          req.flash("errors", { msg: "Account with that email address does not exist." });
          return res.redirect("/forgot");
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user);
        });
      });
    },
    function sendForgotPasswordEmail(token: AuthToken, user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: "hackathon@starter.com",
        subject: "Reset your password on Hackathon Starter",
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
        done(err);
      });
    }
  ], (err) => {
    if (err) { return next(err); }
    res.redirect("/forgot");
  });
};