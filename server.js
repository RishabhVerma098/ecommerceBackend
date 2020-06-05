const Express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
require("colors");

//initialization
const app = Express();
dotenv.config({ path: "./config/config.env" });

//import routes
const product = require("./routes/product");

//middleware
app.use(morgan("dev"));
app.use("/api/v1/product", product);

//port listen
const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(
    `sever is running in ${process.env.NODE_ENV} at Port:${port}`.yellow.bold
  )
);

//crash app on some unprocessed error
process.on("unhandledRejection", (err, promisee) => {
  console.log(`Error : ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
