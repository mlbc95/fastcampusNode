/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as validator from "validator";
import * as lodash from "lodash";
import * as expressValidator from "express-validator";
import * as jwt from "./config/jwt";
import * as admin from "firebase-admin";
const serviceAccount = require("./fastcampusdbServiceKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fastcampusdb.firebaseio.com"
});
const convoRef = admin.database().ref("convos");
const newConvoRef = convoRef.push();
const today = new Date();
newConvoRef.update({users: ["asdf"], messages: [], created: today}).then(() => {});
const MongoStore = mongo(session);

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });


/**
 * Controllers (route handlers).
 */
import * as signupController from "./controllers/signup";
import * as loginController from "./controllers/login";
import * as studentController from "./controllers/student";
import * as teacherController from "./controllers/teacher";
import * as courseController from "./controllers/course";
import * as convoController from "./controllers/convo";

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from "./config/passport";

// enabling Cors for typescript
import * as cors from "cors";

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;


/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(lusca.xssProtection(true));


// Allow CORS
app.use("/*", function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  if ("OPTIONS" === req.method) {
    // res.header("Allow", "POST, GET, PATCH, PUT, DELETE, OPTIONS");
    return res.send(200);
  } else {
    next();
  }
});


app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));


// swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
//  app.use(middleware.swaggerUi());
// });

/**
 * Primary app routes.
 */
// Singup and login routes
app.post("/convo", convoController.postConvo);

app.use(function (req, res) {
  return res.status(404).json({err: "invalid request"});
});

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;