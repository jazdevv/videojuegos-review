// Import the express module
const path = require('path');
const express = require("express");
// Instantiate an Express application
const app = express();
const dotenv = require("dotenv").config();
const ActionsRouter = require('./routers/actions-router');
const UserRouter = require('./routers/user-router');
const viewsRouter = require('./routers/views-router');
const cookieparser = require('cookie-parser');

// app.use('/static',express.static(path.join(__dirname, '/public')));



// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


//read the cookies from response
app.use(cookieparser(path.join(__dirname, '/public')));

console.log(path.join(__dirname, 'public'))
//create the req.body 
app.use(express.json());

//user

app.use("/",viewsRouter);
app.use("/api",UserRouter);
app.use("/useractions",ActionsRouter);


//set static files that are rendered after
// app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, "public")));
module.exports = app;