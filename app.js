
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

const loginSchema= new mongoose.Schema({
  userID: String,
  role: {
    type: String, default:"" 
  },
    username:String,
    password:String

  });


const plantSchema = new mongoose.Schema({
  plnatID: {
    type: String, default:"" 
  },
  role: {
    type: String, default:"" 
  },
    username:String,
    password:String,
    name: String,
    email:String,
    phoneno:String ,
    plantCords: String
  });
  


  const hospitalSchema = new mongoose.Schema({
    plnatID: {
      type: String, default:"" 
    },
    role: {
      type: String, default:"" 
    },
      username:String,
      password:String,
      name: String,
      email:String,
      phoneno:String ,
      plantCords: String
    });
    


  loginSchema.plugin(passportLocalMongoose);
  loginSchema.plugin(findOrCreate);


///models here


const User =  mongoose.model("User",loginSchema);
const Hospital =  mongoose.model("Hospital",hospitalSchema);
const Plant =  mongoose.model("Plant",plantSchema);




  passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser( function(user, done) {
  User.findById(user._id, function (err, user) {
    done(err, user);
  });
});




passport.use(new LocalStrategy(
  (username, password, done) => {

function ls(){
  User.findOne({ username: username },   function (err, user) {

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


 app.get("/hospitalRegistration", (req, res)=>{
  res.render("hospitalRegistration")
});


app.get("/newOrder", (req, res)=>{
  res.render("newOrder")
});



 app.post("/plantReg", (req, res)=>{
    const plantdata = req.body;
    console.log(req.body);
console.log("////");
    const len = 6;
    const pattern = "0";
    const id = randomId(len, pattern);





    User.register({ username: req.body.username }, req.body.password, function (err, client) {
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
              User.findOneAndUpdate({ "username": req.body.username },
              { userID: id, password: hash, role:req.body.role }, { new: true, upsert: true }).exec();
              console.log(hash + "hash");
            }); 
               
          });
  
  
        }
      });

      function wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }
      

     console.log('before');
     wait(1000);  
     console.log('after');

    const plantdetails = new Plant({
      plnatID: id,
      role: plantdata.role,
        name: plantdata.plantName,
        username: plantdata.username,
        plantCords: plantdata.plantCords,
        email: plantdata.email,
        phoneno: plantdata.phoneno,
      });
  
  
      console.log('before');
  wait(2000);  
  console.log('after');
  
  
  
  
      plantdetails.save();
    

      res.redirect("/register");


 });
 






 app.post("/hospReg", (req, res)=>{
  const hospdata = req.body;
  console.log(req.body);
console.log("////");
  const len = 6;
  const pattern = "0";
  const id = randomId(len, pattern);





  User.register({ username: req.body.username }, req.body.password, function (err, client) {
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
            User.findOneAndUpdate({ "username": req.body.username },
            { userID: id, password: hash, role:req.body.role }, { new: true, upsert: true }).exec();
            console.log(hash + "hash");
          }); 
             
        });


      }
    });

    function wait(ms){
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
     }
   }
    

   console.log('before');
   wait(1000);  
   console.log('after');

  const hospdetails = new Hospital({
    plnatID: id,
    role: hospdata.role,
      name: hospdata.plantName,
      username: hospdata.username,
      plantCords: hospdata.plantCords,
      email: hospdata.email,
      phoneno: hospdata.phoneno,
    });


    console.log('before');
wait(2000);  
console.log('after');




hospdetails.save();
  

    res.redirect("/hospitalRegistration");


});




 


  server.listen(port, () => {
    console.log("Server is listening at port 3000...");
  });
  

