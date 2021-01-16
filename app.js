//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// variables
const saltRounds = 10;

// home page GET method


/****************************** end of dynamic list ******************************* */

/****************************** Start of Delete route ******************************* */



/****************************** End of Delete route ******************************* */



// mongoose started
let mongoose = require('mongoose');
// fruitDB is created and also connected to the localhost
// mongoose.connect("mongoose.connect(mongodb://localhost:27017/blogDB"
//mongoose.connect("mongodb+srv://*****:*****@cluster0.4ybth.mongodb.net/blogDB"
mongoose.connect("mongodb+srv://"+process.env.DB_USER+":" + process.env.DB_PASSWORD+"@cluster0.4ybth.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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

// 2 --> create a model

const User = mongoose.model("User", userSchema);



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
  let userEmail = request.body.username ;
  let userPassword = request.body.password ;
  // checking any user exixst by this email ....
  User.findOne({user_email: userEmail }, function (err, doc){
    if(!err){
      console.log(doc);
      if (doc) {
        console.log("this user is already exist in the system");
        response.redirect('/login')
      }else{

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(userPassword, salt, function(err, hashPassword) {
              if (!err) {
                let user = new User({
                  user_email : userEmail,
                  user_password : hashPassword
                })
                user.save(function(err){
                  if(!err){
                    console.log("user is created successfully......")
                    response.redirect('/login')
                  }else{
                    console.log(err);
                  }
                })

              }else{
                response.redirect('/register')
              }

            });
        });

      }
    }else{
      console.log("database error ....");
      response.redirect('/')
    }
  });

})

/**************************************************************************/
app.get('/login', function(request, response){
  response.render('login')
})
/*****/
app.post('/login', function(request, response){
  let userEmail = request.body.username ;
  let userPassword = request.body.password ;
  User.findOne({user_email: userEmail}, function (err, docFound){
    if(!err){
      console.log(docFound);
      if (docFound) {
        bcrypt.compare(userPassword, docFound.user_password, function(error, passwordMatched){
          if (passwordMatched === true) {
            response.redirect('/secrets')
          }else{
            response.redirect('/login')
          }
        });

      }else{
        console.log("email does not exist in the system");
        response.redirect('/login')
      }
    }else{
      console.log("database error ....");
      response.redirect('/')
    }
  });
})

/*********************************************************/
app.get('/secrets', function(request, response){
  response.render('secrets')
})

/***************************************************/

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
