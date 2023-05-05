const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "./config/cofig.env"});
const app = require("./app");
const port = process.env.PORT;
const db = process.env.DATABASE;

mongoose.connect(db, {
  useNewUrlParser : true,
  useUnifiedTopology : true
}).then(()=>{
  console.log("Mongodb connected successfully..");
}).then(()=>{
  app.listen(port, ()=>{
    console.log(`listening to port : ${port}`);
  });
}).catch((e)=>{
  console.log(e.message);
});



