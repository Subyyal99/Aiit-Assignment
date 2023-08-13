const express = require("express");
let cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const db = require("./models");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { Users } = require("./models");

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Retrieve all users or a single user based on userId
app.get("/users/:userId?", (req, res) => {
  const { userId } = req.params;
  const queryOptions = {
    order: [["createdAt", "DESC"]], // Order by createdAt in descending order
  };
  if (userId) {
    Users.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    // Find all users
    Users.findAll(queryOptions)
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
});

app.post("/insert", async (req, res) => {
  try {
    const { fullName, address, dateOfBirth, phoneNumber, email } = req.body;
    // Checking if a user with the given email already exists
    const existingUserByEmail = await Users.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }
    // Checking if a user with the given phone number already exists
    const existingUserByPhoneNumber = await Users.findOne({
      where: { phoneNumber },
    });

    if (existingUserByPhoneNumber) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists." });
    }
    const newUser = await Users.create({
      fullName,
      address,
      dateOfBirth,
      phoneNumber,
      email,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const { fullName, address, dateOfBirth, phoneNumber, email } = req.body;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (email && email !== user.email) {
      const existingUserByEmail = await Users.findOne({
        where: { email },
      });
      if (existingUserByEmail) {
        return res
          .status(400)
          .json({ error: "Another user with this email already exists." });
      }
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingUserByPhoneNumber = await Users.findOne({
        where: { phoneNumber },
      });
      if (existingUserByPhoneNumber) {
        return res.status(400).json({
          error: "Another user with this phone number already exists.",
        });
      }
    }
    // Updating the user's fields
    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
