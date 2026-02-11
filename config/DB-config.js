const mongoose = require('mongoose');
// const mongoURI =  process.env.DB_URI 
const mongoURI = 'mongodb://localhost:27017/Editable-Portfolio_1_DB_Preview';

const connectDB = async() => {
  try{
    await mongoose.connect(mongoURI);
    console.log('Connected to the database');
  } catch(err) {
    console.log("Connection failed:",err);
  }
}


module.exports = {connectDB}