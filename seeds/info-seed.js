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

// const MONGO_URI = "mongodb://localhost:27017/Editable-Portfolio_1_DB";
const MONGO_URI = "mongodb+srv://harvey:Harvey152312@cluster0.tylqtxy.mongodb.net/editable-portfolio_1?retryWrites=true&w=majority";

async function seedInfo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

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
      { number: "1", name: "First Achievement" },
      { number: "2", name: "Second Achievement" },
    ]);

    // ================= EDUCATION =================
    await Education.insertMany([
      {
        title: "Bachelor of Science",
        institution: "University ABC",
        details: "Major in CS",
        dateRange: "2015 - 2019",
      },
      {
        title: "High School",
        institution: "XYZ High School",
        details: "High School Diploma",
        dateRange: "2011 - 2015",
      },
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
      name: "John Doe",
      cvFile: null,
      cvFilePublicId: null,
      aboutMe: "Full-stack developer with passion for web apps",
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
        type: "Web Development",
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
      { skillName: "JavaScript" },
      { skillName: "Node.js" },
      { skillName: "React" },
      { skillName: "MongoDB" },
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
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedInfo();
