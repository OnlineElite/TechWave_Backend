const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const pool = require("../config/db");


async function register(req, res) {
  const { firstname, lastname, email, username, password } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await User.findByemail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const query = "INSERT INTO users (first_name, last_name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5)";
    await pool.query(query, [firstname, lastname, username, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}



async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findByemail(email);
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Check if the provided password matches the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const secretKey = process.env.SECRET_KEY;

    // Generate a unique session ID
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Generate and return a JWT
    const token = jwt.sign(
      { id: user.user_id },
      secretKey,
      {
        expiresIn: "3h",
      }
    ); //mybe you should change user.id by user.user_id

    // Insert the user into the login table
    //const query = "INSERT INTO login (email, password_hash, user_id) VALUES ($1, $2, $3)";
    //await pool.query(query, [email, user.password_hash, user.user_id]);
    res.json({
      token: token,
      isAdmin: user.admin,
      userEmail: user.email,
      fullName: [user.first_name, user.last_name, user.user_id],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function logout(req, res) {
  const { email } = req.body;

  try {
    // delete the user from the login table
    const query = "delete from login where email = $1";
    await pool.query(query, [email]);

    res.status(201).json({ message: "User loged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { register, login, logout };

