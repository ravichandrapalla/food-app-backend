const express = require("express");

const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const approutes = require("./routes/routes").default;
// const { default: mongoose } = require("mongoose");
const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use("/api/", approutes);

app.listen(PORT, () => {
  console.log("serer is running on port", PORT);
});
