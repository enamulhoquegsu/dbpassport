//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const session = require('express-session');

const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
// variables


// home page GET method


/****************************** end of dynamic list ******************************* */

/****************************** Start of Delete route ******************************* */



/****************************** End of Delete route ******************************* */


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

/********************************************************************************/

// mongoose started
let mongoose = require('mongoose');
// fruitDB is created and also connected to the localhost
// mongoose.connect("mongoose.connect(mongodb://localhost:27017/blogDB"
//mongoose.connect("mongodb+srv://*****:*****@cluster0.4ybth.mongodb.net/blogDB"
mongoose.connect("mongodb+srv://"+process.env.DB_USER+":" + process.env.DB_PASSWORD+"@cluster0.4ybth.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex",true);
// 1. blogSchema is created
const blogSchema = new mongoose.Schema({
  title: String,
  body : String,
});
blogSchema.set('timestamps', true);
// model is created from the  fruitSchema
const Blog = mongoose.model("Blog", blogSchema);

// now instance of fruit objects

/************************************************************************************* */
// 1 --> user schema
const userSchema = new mongoose.Schema({
  user_email : String,
  user_password : String
})
userSchema.plugin(passportLocalMongoose);

// 2 --> create a model

const User = mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/************************************************************************************* */
// main Schema
const mainList = new mongoose.Schema({
  name: String
})


const Main = mongoose.model("Main", mainList)


/************************************************************************************* */
/************************************************************************************* */

// skill schema
const skillList = new mongoose.Schema({
  name: String
})
// Skill model
const Skill = mongoose.model("Skill", skillList)

let skill1 = new Skill({
  name: "PHP Developer"
})

/************************************* listSchema ************************************************ */
const dynamicSchema = new mongoose.Schema({
  name: String,
  items: [mainList]
});

const DynamicList = mongoose.model('DynamicList', dynamicSchema);

// *******************************************   mongoose end here

app.get('/', function(request, response){
  response.render('home')
})
/**************************************************************************/
app.get('/register', function(request, response){
  response.render('register')
})
/*****/
app.post('/register', function(request, response){


  User.register({username:request.body.username}, request.body.password, function(err, user) {
    if (!err) {
      //var authenticate = User.authenticate();
      passport.authenticate('local')(request, response, function(){
        response.redirect('/secrets');
      })
    }else{
      console.log(err);
      console.log("something is wrong..");
      response.redirect('/register')
    }
  });


})

/******************************** Get & Post login ****************************************/
app.get('/login', function(request, response){

  response.render('login')

})
/*****/
app.post('/login', function(request, response){
  const user = new User({
    username: request.body.username,
    password: request.body.password
  })
  request.login(user, function(err){
    if(!err){
      passport.authenticate('local')(request, response, function(){
        response.redirect('/secrets');
      })
    }else{
      console.log(err);
      response.redirect('/login')
    }
  })

})

/*********************************************************/
app.get('/secrets', function(request, response){
  if(request.isAuthenticated()){
    response.render('secrets')
  }else{
    response.redirect('/login')
  }

})


/**********************************Log out page***********************/

app.get('/logout', function(request, response){
  request.logout();
  response.redirect('/')
})


/***************************************************/

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
