const Express = require("express");
const dotenv = require("dotenv");
require("colors");

//initialization
const app = Express();
dotenv.config({ path: "./config/config.env" });

//main
app.get("/", (req, res) => {
  res.send({
    sucesss: true,
    data: "hello world",
    env: process.env.TEXT,
  });
});

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
