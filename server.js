const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const mongo = require('mongojs');
const path = require('path');
const PORT = process.env.PORT || 3000;


const db = require("./models/index.js");

const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname+"/public")));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

app.get("/",(req,res)=>{
    res.sendFile("index.html");
});

app.get("/api/workouts", (req,res)=>{
  db.Workout.find({},(err,data)=>{
    if(err){
      res.status(500).send(err);
    }else{
      res.json(data);
    }
  });
});


app.post("/api/workouts", (req,res)=>{
  db.Workout.create({},(err,data)=>{
    if(err){
      res.status(500).send(err);
    }else{
      res.json(data);
    }
  });
});

app.get("/exercise?id=:id", (req,res)=>{
  let id = req.params.id;
  console.log("adding to existing workout", id);
  db.Workout.find({_id: mongo.ObjectID(id)},(err,data)=>{
    if(err){
      res.status(500).send(err.message);
    }else{
      res.json(data);
    }
  });
});

app.get("/exercise", (req,res)=>{
  console.log("going to new exercise");
  res.sendFile(path.join(__dirname+"/public/exercise.html"));
});



app.put("/api/workouts/:id", (req,res)=>{
  let id = req.params.id;
  let exercise = req.body;
  db.Workout.updateOne({_id: mongo.ObjectID(id)},{$push:{exercises:exercise}},(err,data)=>{
    if(err){
      res.status(500).send(err.message);
    }else{
      res.json(data);
    }
  });
});

app.get("/api/workouts/range", (req,res)=>{
  db.Workout.find({}, (err,data)=>{
    res.json(data);
  });
});

app.get("/stats", (req,res)=>{
  res.sendFile(path.join(__dirname+"/public/stats.html"));
});
// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
