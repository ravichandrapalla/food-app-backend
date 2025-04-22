const express = require("express");
const mangoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const approutes = require("./routes/routes");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use("/api/", approutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("connected to mongoose"));
  })
  .catch((err) => console.log(err));
