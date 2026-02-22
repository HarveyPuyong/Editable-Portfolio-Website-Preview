require("dotenv").config();

const Express = require("express");
const app = Express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/cors-option");
const dbConn = require("./config/DB-config");
const logEvents = require("./middlewares/log-events");
const errorHandler = require("./middlewares/error-handler");
const credentials = require("./middlewares/credentials");
const {
  resetDatabase,
  startResetDBScheduler,
} = require("./utils/reset-database-scheduler");
const PORT = process.env.PORT || 4500;

// If running in production behind a proxy (Render, Heroku, Railway), enable trust proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  console.log("Trust proxy enabled (production)");
}

dbConn.connectDB();

app.use(logEvents);

app.use(credentials);

app.use(cors(corsOptions));

app.use(Express.json());

app.use(cookieParser());

app.use(Express.static(path.join(__dirname, "frontend")));

app.use("/uploads", Express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return res.redirect("main-page.html");
});

app.use("/auth", require("./routes/auth-route"));
app.use("/main-info", require("./routes/main-info-route"));
app.use("/skill", require("./routes/skill-route"));
app.use("/achievement", require("./routes/achievement-route"));
app.use("/experience", require("./routes/experience-route"));
app.use("/project", require("./routes/project-route"));
app.use("/education", require("./routes/education-route"));
app.use("/tool", require("./routes/tool-route"));
app.use("/contact", require("./routes/contact-form-emailer-route"));
// reset database route
app.use("/reset-db", require("./routes/reset-db-route"));

app.use(errorHandler);

mongoose.connection.once("open", async () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);

  // ensure default data present on startup
  try {
    await resetDatabase();
  } catch (error) {
    console.error("Initial database reset failed:", error);
  }

  startResetDBScheduler();

  app.listen(PORT, () =>
    console.log(`Server is listen to port: http://localhost:${PORT}`),
  );
});
