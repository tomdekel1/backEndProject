require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;
const bcrypt = require("bcrypt");
const cors = require("cors");
const initialUsers = require("./initialUsers");
const initialCards = require("./initialCards");
const { User } = require("./model/users");
const { Card } = require("./model/cards");

app.use(require("morgan")("dev"));
app.use(express.json());
app.use(cors());
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cards", require("./routes/cards"));

connect();

async function connect() {
  try {
<<<<<<< HEAD
    await mongoose.connect("mongodb://localhost:27017/myRestAPI");
=======
    await mongoose.connect(
      "mongodb://localhost:27017/myRestAPI"
    );
>>>>>>> 61852d1b8e050b1491bd4a42daa1fa85a2b41d20
    console.log("conected to db");
    app.listen(PORT, () => {
      console.log("server is listening");
    });
    createSeedData();
  } catch (e) {
    console.log(e.message);
    return;
  }
}

async function createSeedData() {
  const isInitialData = await User.find();
  if (isInitialData.length >= 3) {
    return;
  }

  initialUsers.forEach(async (user) => {
    try {
      const newUser = await new User(user);
      newUser.password = await bcrypt.hash(user.password, 12);
      newUser.save();
    } catch (e) {
      console.log(e.message);
      return;
    }
  });

  initialCards.forEach(async (card) => {
    try {
      const newCard = await new Card(card);
      newCard.save();
    } catch (e) {
      console.log(e.message);
      return;
    }
  });
}
