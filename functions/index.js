const functions = require("firebase-functions");
// "firebase-functions" is specifically for Firebase's cloud hosting.
// Here I am hosting my server in the cloud
const cors = require("cors");
const express = require("express");
const expressApp = express();
const firebaseAdmin = require("firebase-admin");
// firebaseAdmin is kind of like PgAdmin. But instead of only a database it offers
// a ton of options, including hosting (which I ended up using in this project)
const bodyParser = require("body-parser");
const { getFirestore } = require("firebase-admin/firestore");

// Middlewares
expressApp.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));
expressApp.use(bodyParser.json());

// Firebase app initialization
firebaseAdmin.initializeApp();

// Database reference. Firestore is the actual database, included in Firebase
const db = getFirestore();

// CRUD OPERATIONS
// My app is a to-do list. So user can add, edit, delete and update a task

// Get task from database
expressApp.get("/", async (req, res) => {
  const snapshot = await db.collection("todo").get();

  const todoList = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  res.send(todoList);
});

// Create new task
expressApp.post("/todos", async (req, res) => {
  // save to firebase, reference is saved as ... reference!
  const reference = await db.collection("todo").add({
    name: req.body.task,
    completed: false,
  });

  // we use the reference to get a snapshot!
  const snapshot = await reference.get();

  // send the firebase snapshot back to the client!
  res.send({
    id: snapshot.id,
    ...snapshot.data(),
  });
});

// Update task (edit). In the database each task has a boolean value, it is either completed or not.
// The default is "completed = false". In the frontend the user can edit tasks to be completed.
expressApp.put("/todos/:id", async (req, res) => {
  await db.collection("todo").doc(req.params.id).update({
    name: req.body.name,
    completed: req.body.completed,
  });

  res.send({
    id: req.params.id,
    name: req.body.name,
    completed: req.body.completed,
  });
});

// Delete task from to-do list
expressApp.delete("/todos/:id", async (req, res) => {
  const reference = await db.collection("todo").doc(req.params.id).delete();
  if (reference.writeTime) {
    res.send("Task deleted!");
  } else {
    res.status(500).send("Failed to delete");
  }
});

// Expose Express API as a single Cloud Function:
exports.app = functions.https.onRequest(expressApp);
