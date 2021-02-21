const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

const statistics = require("./routes/api/statistics");

app.use("/api", statistics);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
