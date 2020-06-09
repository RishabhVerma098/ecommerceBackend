const Express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const Sentry = require("@sentry/node");
require("colors");
const cors = require("cors");

//initialization
const app = Express();
dotenv.config({ path: "./config/config.env" });
const connectDb = require("./config/db");
Sentry.init({
  dsn:
    "https://ae78cfa4812c4f8dad30f606f9011e2f@o403974.ingest.sentry.io/5267425",
});

//import routes and middlewares
const product = require("./routes/product");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/user");
const cart = require("./routes/cart");
const mygame = require("./routes/mygame");
const payment = require("./routes/payment");

//middleware
// *The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use(morgan("dev"));
app.use(Express.json());

app.use("/api/v1/product", product);
app.use("/api/v1/auth", auth);
app.use("/api/v1/cart", cart);
app.use("/api/v1/mygames", mygame);
app.use("/api/v1/payment", payment);
// * The error handler must be before any other error middleware and after all controllers
app.use(
  Sentry.Handlers.errorHandler({
    serverName: false,
    user: ["email"],
  })
);
app.use(errorHandler);
connectDb();

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
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
