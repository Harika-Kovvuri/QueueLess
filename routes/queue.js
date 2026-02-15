// const express = require("express");
// const router = express.Router();
// const db = require("../firebase");

// // Middleware to check login
// function checkAuth(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect("/");
//   }
//   next();
// }

// // Dashboard GET
// router.get("/", checkAuth, async (req, res) => {
//   try {
//     const snapshot = await db.collection("queueEntries")
//       .where("status", "==", "waiting")
//       // .orderBy("time", "asc")
//       .get();

//     const queue = [];
//     snapshot.forEach(doc => {
//       queue.push({ id: doc.id, ...doc.data() });
//     });

//     res.render("dashboard", { name: req.session.userName, queue });
//   } catch (err) {
//     console.error(err);
//     res.send("Error loading dashboard");
//   }
// });

// // Add visitor POST
// router.post("/add", checkAuth, async (req, res) => {
//   const { visitorName, purpose } = req.body;

//   try {
//     await db.collection("queueEntries").add({
//       visitorName,
//       purpose,
//       time: new Date().toISOString(),
//       status: "waiting"
//     });

//     res.redirect("/queue");
//   } catch (err) {
//     console.error(err);
//     res.send("Error adding visitor");
//   }
// });

// // Mark as served POST
// router.post("/serve/:id", checkAuth, async (req, res) => {
//   const id = req.params.id;

//   try {
//     await db.collection("queueEntries").doc(id).update({
//       status: "served"
//     });

//     res.redirect("/queue");
//   } catch (err) {
//     console.error(err);
//     res.send("Error updating queue");
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const db = require("../firebase");

// // Middleware to protect dashboard
// function checkAuth(req, res, next){
//   if(!req.session.userId) return res.redirect("/");
//   next();
// }

// // Dashboard
// router.get("/", checkAuth, async (req,res)=>{
//   try {
//     const snapshot = await db.collection("queueEntries")
//       .where("status","==","waiting").get();
//     const queue = [];
//     snapshot.forEach(doc=>queue.push({ id: doc.id, ...doc.data() }));
//     res.render("dashboard", { name: req.session.userName, queue });
//   } catch(err){ console.error(err); res.send("Error loading dashboard."); }
// });

// // Add visitor
// router.post("/add", checkAuth, async (req,res)=>{
//   const { visitorName, purpose } = req.body;
//   try{
//     await db.collection("queueEntries").add({
//       visitorName,
//       purpose,
//       time: new Date().toISOString(),
//       status: "waiting"
//     });
//     res.redirect("/queue");
//   }catch(err){ console.error(err); res.send("Error adding visitor"); }
// });

// // Mark served
// router.post("/serve/:id", checkAuth, async (req,res)=>{
//   const id = req.params.id;
//   try{
//     await db.collection("queueEntries").doc(id).update({ status:"served" });
//     res.redirect("/queue");
//   }catch(err){ console.error(err); res.send("Error updating queue"); }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const db = require("../firebase");

// Middleware to protect dashboard
function checkAuth(req,res,next){
  if(!req.session.userId) return res.redirect("/");
  next();
}

// Staff Dashboard
router.get("/staff", checkAuth, async (req,res)=>{
  if(req.session.role!=="staff") return res.send("Access Denied");

  try{
    const snapshot = await db.collection("queueEntries").where("status","==","waiting").get();
    const queue = [];
    snapshot.forEach(doc=>queue.push({ id: doc.id, ...doc.data() }));
    res.render("staffDashboard",{ name:req.session.userName, queue });
  }catch(err){ console.error(err); res.send("Error loading dashboard"); }
});

// Add Visitor (by Staff)
router.post("/staff/add", checkAuth, async (req,res)=>{
  const { visitorName, purpose } = req.body;
  try{
    await db.collection("queueEntries").add({
      visitorName, purpose, time: new Date().toISOString(),
      status:"waiting", addedBy:"staff"
    });
    res.redirect("/queue/staff");
  }catch(err){ console.error(err); res.send("Error adding visitor"); }
});

// Mark served
router.post("/serve/:id", checkAuth, async (req,res)=>{
  const id = req.params.id;
  try{
    await db.collection("queueEntries").doc(id).update({ status:"served" });
    if(req.session.role==="staff") res.redirect("/queue/staff");
    else res.redirect("/queue/visitor");
  }catch(err){ console.error(err); res.send("Error updating queue"); }
});

// Visitor Dashboard
router.get("/visitor", checkAuth, async (req,res)=>{
  if(req.session.role!=="visitor") return res.send("Access Denied");

  try{
    const snapshot = await db.collection("queueEntries")
      .where("visitorId","==",req.session.userId)
      .orderBy("time","desc")
      .get();
    const history = [];
    snapshot.forEach(doc=>history.push({ id: doc.id, ...doc.data() }));
    res.render("visitorDashboard",{ name:req.session.userName, history });
  }catch(err){ console.error(err); res.send("Error loading visitor dashboard"); }
});

// Visitor joins queue
router.post("/visitor/add", checkAuth, async (req,res)=>{
  const { purpose } = req.body;
  try{
    await db.collection("queueEntries").add({
      visitorId:req.session.userId,
      visitorName:req.session.userName,
      purpose,
      time: new Date().toISOString(),
      status:"waiting",
      addedBy:"visitor"
    });
    res.redirect("/queue/visitor");
  }catch(err){ console.error(err); res.send("Error adding to queue"); }
});

module.exports = router;
