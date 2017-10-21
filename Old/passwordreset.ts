import * as crypto from "crypto";
import * as passport from "passport";
import * as lodash from "lodash";
import { default as User, UserModel, AuthToken  } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LocalStrategyInfo } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");