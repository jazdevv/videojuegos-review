

const mongoose = require("mongoose");
const app = require("./app")
// Import builtin NodeJS modules to instantiate the service
const http = require("http");
const dotenv = require("dotenv").config(); // si quiero poner config.env const dotenv = require("dotenv").config({path: "./config.env"}); 
console.log(process.env.NODE_ENV)
let db;
if(process.env.NODE_ENV == "production"){
    db = process.env.DATABASE.replace("<password>",process.env.DATABASE_ATLAS_PASSWORD);
} else if (process.env.NODE_ENV === "development"){
    db = process.env.DATABASE_DEV.replace("<password>",process.env.DATABASE_ATLAS_PASSWORD);
}


//console.log(db)
//DB CONNECT DE MOMENTO ATLAS MONGO DB MAS ALANTE USAR EL MONGODB DE UBUNTU Y INSTALARLO
mongoose.connect(db).then(con => {
    //console.log(con.connections);
    console.log("DB CONNECTED");
});
// ,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false,
//     useUnifiedTopology:true
// }
//console.log(process.env);

const port = process.env.PORT || 3000;

// http.createServer(app).listen(3000,()=>{
//     console.log("listening on port 3000");
// })

const server = app.listen(port,()=>{
    console.log(`listening on port ${port}`)});