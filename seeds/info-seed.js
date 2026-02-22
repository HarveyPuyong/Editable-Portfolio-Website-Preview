// info-seed.js
require("dotenv").config();
const mongoose = require("mongoose");

// Models
const Achievement = require("../models/achievement-schema");
const Education = require("../models/education-schema");
const Experience = require("../models/experience-schema");
const MainInfo = require("../models/main-info-schema");
const Project = require("../models/project-schema");
const Skill = require("../models/skill-schema");
const Tool = require("../models/tool-schema");

const MONGO_URI = 'mongodb://localhost:27017/Editable-Portfolio_1_DB_Preview';
//const MONGO_URI = 'mongodb+srv://harvey:Harvey152312@cluster0.tylqtxy.mongodb.net/editable-portfolio_1_preview?retryWrites=true&w=majority';

async function seedInfo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Info Seed Connected to MongoDB");

    // ================= CLEAR DATA =================
    await Promise.all([
      Achievement.deleteMany({}),
      Education.deleteMany({}),
      Experience.deleteMany({}),
      MainInfo.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Tool.deleteMany({}),
    ]);

    console.log("Existing data cleared!");

    // ================= ACHIEVEMENTS =================
    await Achievement.insertMany([
      { number: "5", name: "First Achievement" },
      { number: "8", name: "Second Achievement" },
    ]);

    // ================= EDUCATION =================
    await Education.insertMany([
      {
        title: "Elementary School",
        institution: "XYZ Elementary School",
        details: "Elementary School Diploma",
        dateRange: "2008 - 2015",
      },
      {
        title: "High School",
        institution: "XYZ High School",
        details: "High School Diploma",
        dateRange: "2016 - 2020",
      },
      {
        title: "Bachelor of Science Technology",
        institution: "University ABC",
        details: "Major in CS",
        dateRange: "2021 - 2025",
      }
    ]);

    // ================= EXPERIENCE =================
    await Experience.insertMany([
      {
        title: "Software Engineer",
        company: "Tech Co.",
        dateRange: "2020 - Present",
        details: "Developed web applications",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
      {
        title: "Intern",
        company: "Startup XYZ",
        dateRange: "2019 - 2020",
        details: "Assisted in front-end development",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
    ]);

    // ================= MAIN INFO =================
    await MainInfo.create({
      profileImage: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263038/default-profile-img_tayqnl.png",
      profileImagePublicId: "default/default-profile-img_tayqnl",
      workAvailability: "available",
      name: "Your Name",
      cvFile: null,
      cvFilePublicId: null,
      aboutMe: "This is about me, I'm a full-stack developer with passion for web apps",
      contactNumber: "09123456789",
      address: "123 Street, City",
      instagramLink: "https://instagram.com",
      tiktokLink: "https://tiktok.com",
      youtubeLink: "https://youtube.com",
      facebookLink: "https://facebook.com",
    });

    // ================= PROJECTS =================
    await Project.insertMany([
      {
        title: "Portfolio Website",
        type: "Website",
        link: "https://portfolio.com",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
      {
        title: "E-commerce App",
        type: "Mobile App",
        link: "https://ecommerce.com",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
    ]);

    // ================= SKILLS =================
    await Skill.insertMany([
      { skillName: "Programmer" },
      { skillName: "Web Developer" },
      { skillName: "UI Desinger" },
    ]);

    // ================= TOOLS =================
    await Tool.insertMany([
      {
        name: "VS Code",
        details: "Code editor",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
      {
        name: "Git",
        details: "Version control system",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
      {
        name: "HTML",
        details: "HyperTxt Markup Language",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
      {
        name: "CSS",
        details: "StyleSheet",
        img: "https://res.cloudinary.com/djn4huijp/image/upload/v1770263039/default-image_cca1xk.png",
        imgPublicId: "default/default-image_cca1xk"
      },
    ]);

    console.log("Database seeded successfully!");
    // do not exit when called programmatically

  } catch (err) {
    console.error("Seeding error:", err);
    throw err;
  }
}

// allow script to run in terminal using this code 'node filename'
if (require.main === module) {
  seedInfo().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedInfo };
