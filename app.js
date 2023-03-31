
const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate');
const axios = require('axios');
const randomId  = require('random-id');
const { isTypedArray } = require('util/types');
const app = express();

const port = 3000;
const server = require("http").createServer(app);


app.use(express.static(__dirname + "/assets/"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "Keep it secret! it's confidential",
    saveUninitialized: true,
    resave: true,
  }));


app.use(passport.initialize());
app.use(passport.session());


mongoose.connect( "mongodb+srv://bpatharun:tharun123@cluster1.3v7i9cn.mongodb.net/BioWaste" , {useNewUrlParser: true}).then(() => {
    console.log("connected to database");
});


///Schemas here

const plantSchema = new mongoose.Schema({
  plnatID: {
    type: String, default:"" 
  },
  role: {
    type: String, default:"PLANT" 
  },
    username:String,
    password:String,
    name: String,
    email:String,
    phoneno:String 
  });
  


  plantSchema.plugin(passportLocalMongoose);
  plantSchema.plugin(findOrCreate);


///models here

const Plant =  mongoose.model("Plant",plantSchema);




  passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser( function(user, done) {
  Plant.findById(user._id, function (err, user) {
    done(err, user);
  });
});




passport.use(new LocalStrategy(
  (username, password, done) => {

function ls(){
    Plant.findOne({ username: username },   function (err, user) {

    console.log(user);


    const hashedPassword = user.password;



    function verifyPassword() {
      bcrypt.compare(password, hashedPassword, (err, result)=>{
        console.log(result + " res");
        if (err) {
          console.log(err);
        }
       });  
    }

    console.log(verifyPassword()  + "SCSACSA");

          return done(null, user);
    
     
     
     });
}

setTimeout(ls, 500)



}

));








app.get("/", (req, res)=>{
   res.render("home")
});

app.get("/register", (req, res)=>{
    res.render("register")
 });






 app.post("/plantReg", (req, res)=>{
    const plantdata = req.body;
    console.log(req.body.username);
console.log("////");
    const len = 8;
    const pattern = 0;
    const id = randomId(8, 0);
    console.log(id + "  ++++++++  ");




    Plant.register({ username: req.body.username }, req.body.password, function (err, client) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        }
        else {
  
          const saltRounds = 10;
          const myPlaintextPassword = req.body.password;
  console.log( saltRounds);
  console.log(myPlaintextPassword);
  
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
              console.log(hash);
              Plant.findOneAndUpdate({ "username": req.body.username },
              { plantID: id, password: hash }, { new: true, upsert: true }).exec();
              console.log(hash + "hash");
            }); 
               
          });
  
  
        }
      });


      
    const plantdetails = new Plant({
        name: plantdata.plantName,
        // username: plantdata.username,
        email: plantdata.email,
        phoneno: plantdata.phoneno,
      });
  
  
    
  
  
  
  
      plantdetails.save();
    




 });
 
 


  server.listen(port, () => {
    console.log("Server is listening at port 3000...");
  });
  

