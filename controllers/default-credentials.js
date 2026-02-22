const UserDB = require('../models/user-schema');

const getCredentials = async (req, res) => {
  try{
    const user = await UserDB.findOne().select("email -_id"); 

    return res.json({
      email: user ? user.email : process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

  }catch(err){
    console.log(err)
  }
}


module.exports = {
  getCredentials
};