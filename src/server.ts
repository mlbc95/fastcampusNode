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
// import * as swaggerTools from "swagger-tools";
// import  * as YAML from "yamljs";
// const swaggerDoc = YAML.load("openapi.yaml");


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
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});


/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


// Allow CORS
app.use("/*", function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("ALLOW", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  if ("OPTIONS" === req.method) {
    res.header("Allow", "POST, GET, PATCH, PUT, DELETE, OPTIONS");
    return res.sendStatus(200);
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
app.post("/auth/signup", signupController.postSignup);
app.options("/auth/signup", signupController.optionsSignUp);
app.post("/auth/login", loginController.postSignin);
app.options("/auth/login", loginController.optionsSignin);
app.post("/auth/logout", loginController.postLogout);
app.options("/auth/logout", loginController.optionsLogout);
// Additional Student routes
app.get("/students", studentController.getStudent);
app.patch("/students", passportConfig.isAuthenticated, studentController.patchStudent);
app.delete("/students", passportConfig.isAuthenticated, studentController.deleteStudent);
app.options("/students", studentController.optionsStudent);
// Additional Teacher routes
app.get("/teachers", teacherController.getTeacher);
app.patch("/teachers", teacherController.patchTeacher);
app.delete("/teachers", teacherController.deleteTeacher);
app.options("/teachers", teacherController.optionsTeacher);
// Course routes
app.post("/courses", courseController.postCourse);
app.get("/courses", courseController.getCourse);
app.patch("/courses", courseController.patchTutor);
app.delete("/courses", courseController.deleteCourse);

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