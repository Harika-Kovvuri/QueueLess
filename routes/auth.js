// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const db = require("../firebase");

// // Login page (GET)
// router.get("/", (req, res) => {
//   res.render("login");
// });

// // Signup page (GET)
// router.get("/signup", (req, res) => {
//   res.render("signup");
// });

// // Signup logic (POST)
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if email already exists
//     const usersRef = db.collection("users");
//     const snapshot = await usersRef.where("email", "==", email).get();

//     if (!snapshot.empty) {
//       return res.send("Email already registered. Please login.");
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user to Firestore
//     await usersRef.add({
//       name: name,
//       email: email,
//       password: hashedPassword
//     });

//     res.send("Signup successful! Please login.");

//   } catch (err) {
//     console.error(err);
//     res.send("Error signing up. Try again.");
//   }
// });

// // Login logic (POST)
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const usersRef = db.collection("users");
//     const snapshot = await usersRef.where("email", "==", email).get();

//     if (snapshot.empty) {
//       return res.send("Email not found. Please signup first.");
//     }

//     // Get user data
//     let user;
//     snapshot.forEach(doc => {
//       user = { id: doc.id, ...doc.data() };
//     });

//     // Compare password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.send("Incorrect password. Try again.");
//     }

//     // Create session
//     req.session.userId = user.id;
//     req.session.userName = user.name;

//     // Redirect to dashboard
//     res.redirect("/queue");

//   } catch (err) {
//     console.error(err);
//     res.send("Error logging in. Try again.");
//   }
// });


// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const db = require("../firebase");

// // Login page
// router.get("/", (req, res) => res.render("login"));

// // Signup page
// router.get("/signup", (req, res) => res.render("signup"));

// // Signup logic
// router.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const usersRef = db.collection("users");
//     const snapshot = await usersRef.where("email", "==", email).get();
//     if (!snapshot.empty) return res.send("Email already registered. Please login.");
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await usersRef.add({ name, email, password: hashedPassword });
//     res.send("Signup successful! Please login.");
//   } catch (err) { console.error(err); res.send("Error signing up."); }
// });

// // Login logic
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const usersRef = db.collection("users");
//     const snapshot = await usersRef.where("email", "==", email).get();
//     if (snapshot.empty) return res.send("Email not found. Please signup.");
//     let user;
//     snapshot.forEach(doc => user = { id: doc.id, ...doc.data() });
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.send("Incorrect password.");
//     req.session.userId = user.id;
//     req.session.userName = user.name;
//     res.redirect("/queue");
//   } catch (err) { console.error(err); res.send("Error logging in."); }
// });

// // Logout
// router.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const db = require("../firebase");

// // Login Page
// router.get("/", (req, res) => res.render("login"));

// // Signup Page
// router.get("/signup", (req, res) => res.render("signup"));

// // Signup Logic
// router.post("/signup", async (req,res)=>{
//   const { name, email, phone, password, role } = req.body;
//   try {
//     const usersRef = db.collection("users");
//     let snapshot;
//     if(role === "staff") snapshot = await usersRef.where("email","==",email).get();
//     else snapshot = await usersRef.where("phone","==",phone).get();

//     if(!snapshot.empty) return res.send("User already exists. Please login.");

//     const hashedPassword = await bcrypt.hash(password,10);
//     await usersRef.add({ name, email: email||"", phone: phone||"", password: hashedPassword, role });
//     res.send("Signup successful! Please login.");
//   } catch(err){ console.error(err); res.send("Error signing up."); }
// });

// // Login Logic
// router.post("/login", async (req, res) => {
//   const { email, phone, password, role } = req.body;

//   if(role === "staff" && !email) return res.send("Email required for staff login");
//   if(role === "visitor" && !phone) return res.send("Phone required for visitor login");

//   try {
//     const usersRef = db.collection("users");
//     let snapshot;
//     if(role === "staff") snapshot = await usersRef.where("email", "==", email).get();
//     else snapshot = await usersRef.where("phone", "==", phone).get();

//     if(snapshot.empty) return res.send("User not found. Please signup.");

//     let user;
//     snapshot.forEach(doc => user = { id: doc.id, ...doc.data() });

//     const match = await bcrypt.compare(password, user.password);
//     if(!match) return res.send("Incorrect password");

//     // Set session correctly
//     req.session.userId = user.id;
//     req.session.userName = user.name;
//     req.session.role = user.role; // MUST be "staff" for staff login

//     if(user.role === "staff") return res.redirect("/queue/staff");
//     return res.redirect("/queue/visitor");

//   } catch(err) {
//     console.error(err);
//     return res.send("Error logging in");
//   }
// });


// // Logout
// router.get("/logout",(req,res)=>{
//   req.session.destroy();
//   res.redirect("/");
// });

// module.exports = router;









const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../firebase"); // make sure your firebase.js exports firestore db

// -----------------------------
// Auth Middleware (No separate folder needed)
const checkAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/"); // not logged in
  }
  next();
};
// -----------------------------

// -----------------------------
// SIGNUP
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const usersRef = db.collection("users");

    // Check if user already exists
    let snapshot;
    if (role === "staff") {
      snapshot = await usersRef.where("email", "==", email).get();
    } else {
      snapshot = await usersRef.where("phone", "==", phone).get();
    }

    if (!snapshot.empty) return res.send("User already exists. Please login.");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = { name, password: hashedPassword, role };
    if (role === "staff") userData.email = email;
    else {
      userData.phone = phone;
      userData.visits = []; // to store history of hospital visits
    }

    await usersRef.add(userData);
    res.send("Signup successful! You can login now.");
  } catch (err) {
    console.error(err);
    res.send("Error during signup. Try again.");
  }
});

// -----------------------------
// LOGIN
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, phone, password, role } = req.body;

  try {
    const usersRef = db.collection("users");
    let snapshot;

    if (role === "staff") {
      if (!email) return res.send("Email required for staff login");
      snapshot = await usersRef.where("email", "==", email).get();
    } else {
      if (!phone) return res.send("Phone number required for visitor login");
      snapshot = await usersRef.where("phone", "==", phone).get();
    }

    if (snapshot.empty) return res.send("User not found. Please signup first.");

    let user;
    snapshot.forEach((doc) => (user = { id: doc.id, ...doc.data() }));

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Incorrect password");

    // Set session
    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.role = user.role;

    // Redirect to dashboards
    if (user.role === "staff") return res.redirect("/queue/staff");
    res.redirect("/queue/visitor");
  } catch (err) {
    console.error(err);
    res.send("Error during login. Try again.");
  }
});

// -----------------------------
// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// -----------------------------
// STAFF DASHBOARD
router.get("/queue/staff", checkAuth, async (req, res) => {
  if (req.session.role !== "staff") return res.send("Access Denied");

  try {
    const snapshot = await db
      .collection("queueEntries")
      .orderBy("time", "asc")
      .get();

    const queue = [];
    snapshot.forEach((doc) => queue.push({ id: doc.id, ...doc.data() }));

    res.render("staffDashboard", { name: req.session.userName, queue });
  } catch (err) {
    console.error(err);
    res.send("Error loading staff dashboard");
  }
});

// Mark visitor as served (staff)
router.post("/serve/:id", checkAuth, async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection("queueEntries").doc(id).update({ status: "served" });
    res.redirect("/queue/staff");
  } catch (err) {
    console.error(err);
    res.send("Error updating queue");
  }
});

// -----------------------------
// VISITOR DASHBOARD
// VISITOR DASHBOARD
router.get("/queue/visitor", checkAuth, async (req, res) => {
  if (req.session.role !== "visitor") return res.send("Access Denied");

  try {
    const queueRef = db.collection("queueEntries");

    // Fetch all entries in 'waiting' status in ascending order of time
    const queueSnapshot = await queueRef
      .where("status", "==", "waiting")
      .orderBy("time", "asc")
      .get();

    const queue = [];
    queueSnapshot.forEach((doc) => queue.push({ id: doc.id, ...doc.data() }));

    // Calculate visitor's position
    let position = "Not in queue";
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].visitorId === req.session.userId) {
        position = i + 1; // 1-based position
        break;
      }
    }

    // Visitor's previous visits (history)
    const historySnapshot = await queueRef
      .where("visitorId", "==", req.session.userId)
      .orderBy("time", "desc")
      .get();

    const history = [];
    historySnapshot.forEach((doc) => history.push({ id: doc.id, ...doc.data() }));

    res.render("visitorDashboard", {
      name: req.session.userName,
      history,
      position,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading visitor dashboard");
  }
});


// Visitor joins queue
router.post("/queue/visitor/add", checkAuth, async (req, res) => {
  const { purpose } = req.body;

  try {
    await db.collection("queueEntries").add({
      visitorId: req.session.userId,
      visitorName: req.session.userName,
      purpose,
      time: new Date().toISOString(),
      status: "waiting",
      addedBy: "visitor",
    });

    res.redirect("/queue/visitor");
  } catch (err) {
    console.error(err);
    res.send("Error adding to queue");
  }
});

// -----------------------------
module.exports = router;
