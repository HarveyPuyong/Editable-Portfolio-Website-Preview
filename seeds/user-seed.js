require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userInfo = require('../models/user-schema');

const MONGO_URI = 'mongodb://localhost:27017/Editable-Portfolio_1_DB_Preview';
//const MONGO_URI = 'mongodb+srv://harvey:Harvey152312@cluster0.tylqtxy.mongodb.net/editable-portfolio_1_preview?retryWrites=true&w=majority';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete any existing admin with the same email
    await userInfo.deleteMany({});

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create the new admin
    await userInfo.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("New admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
