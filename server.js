const Express = require("express");

const app = Express();

app.get("/", (req, res) => {
  res.send({
    sucesss: true,
    data: "hello world",
  });
});

app.listen(8000, console.log(`sever is running at Port:8000`));
