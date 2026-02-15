// const express = require("express");
// const session = require("express-session");

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// app.use(
//   session({
//     secret: "queueless_secret",
//     resave: false,
//     saveUninitialized: false
//   })
// );

// // View engine
// app.set("view engine", "ejs");

// // Routes
// const authRoutes = require("./routes/auth");
// const queueRoutes = require("./routes/queue");

// app.use("/", authRoutes);
// app.use("/queue", queueRoutes);

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`QueueLess running on http://localhost:${PORT}`);
// });




// const express = require("express");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();
// // server.js

// // Static files
// app.use(express.static(path.join(__dirname, "public")));

// const authRoutes = require("./routes/auth");
// const queueRoutes = require("./routes/queue");

// // EJS setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Body parser
// app.use(bodyParser.urlencoded({ extended: true }));

// // Static files
// app.use(express.static(path.join(__dirname, "public")));

// // Session setup
// app.use(session({
//   secret: "QueueLessSecret",
//   resave: false,
//   saveUninitialized: false
// }));

// // Routes
// app.use("/", authRoutes);
// app.use("/queue", queueRoutes);

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const authRoutes = require("./routes/auth");
const queueRoutes = require("./routes/queue");

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(session({
  secret: "HospitalQueueSecret",
  resave: false,
  saveUninitialized: false
}));

app.use(session({
  secret: "QueueLessSecretKey",
  resave: false,
  saveUninitialized: true
}));

// Routes

app.get("/", (req, res) => {
  res.render("introduction");
});


app.use("/", authRoutes);
app.use("/queue", queueRoutes);


// Render login page
app.get("/login", (req, res) => {
  res.render("login"); // login.ejs
});

// Render signup page
app.get("/signup", (req, res) => {
  res.render("signup"); // signup.ejs
});

// Staff Dashboard
app.get("/queue/staff", (req, res) => {
  if(!req.session.userId || req.session.role !== "staff") {
    return res.send("Access Denied");
  }

  res.render("staffDashboard", {
    name: req.session.userName,
    queue: [] // optionally pass queue data
  });
});


// Visitor Dashboard
// app.get("/queue/visitor", async (req, res) => {
//   if(!req.session.userId || req.session.role !== "visitor") {
//     return res.send("Access Denied");
//   }

//   try {
//     const userRef = db.collection("users").doc(req.session.userId);
//     const userDoc = await userRef.get();
//     let history = [];

//     if(userDoc.exists && userDoc.data().visits) {
//       history = userDoc.data().visits; // array of previous visits
//     }

//     res.render("visitorDashboard", {
//       name: req.session.userName,
//       history: history
//     });
//   } catch(err) {
//     console.error(err);
//     res.send("Error loading visitor dashboard");
//   }
// });

app.get("/queue/visitor", async (req, res) => {
  if(!req.session.userId || req.session.role !== "visitor") return res.send("Access Denied");

  const db = require("./firebase"); // your firebase setup
  const userRef = db.collection("users").doc(req.session.userId);
  const userDoc = await userRef.get();
  let history = [];
  if(userDoc.exists && userDoc.data().visits) history = userDoc.data().visits;

  res.render("visitorDashboard", { name: req.session.userName, history });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
