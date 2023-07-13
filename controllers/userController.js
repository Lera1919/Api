const Media = require("../models").Media;
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Profile = require("../models").Profile;




exports.update = async (req, res) => {

  const {
    firstName, 
    lastName, 
    password, 
    newPassword, 
    phone,
    description,
    latitude,
    longitude,
    commercial
  } = req.body;

  const userUpdateData = {};

  if (firstName !== req.user.firstName) {
    userUpdateData.firstName = firstName
  }
  if (lastName !== req.user.lastName) {
    userUpdateData.lastName = lastName
  }
  if (newPassword  
    && newPassword.length >0 
    && password 
    && password.length >0 
    ) {

      const user = await User.findOne({ where: { id: req.user.id } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const password = await bcrypt.hash(newPassword, 5);
        userUpdateData.password = password;
      }
    }
    // console.log(userUpdateData);
    if (Object.keys(userUpdateData).length !== 0) {
      await User.update(userUpdateData, {
        where: {
          id: req.user.id
        }
      });
    }



  



  // console.log('----------------------');
  // console.log(req.body);
  // console.log('----------------------');
  // console.log(req.user);

  return res.status(200).json({"message":  "Файл изменен"});
};

exports.avatar = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({"message":  "Файл пуст"});
  }
  

  const media = await Media.create({
    "model": 'User',
    "modelId": req.user.id,
    "type": req.file.mimetype,
    "size": req.file.size,
    "fieldName": req.file.fieldname,
    "path": req.file.key,
});

return res.status(200).json({"message":  "Файл сохранен"});
};



exports.profile = async (req, res) => {

  return res.status(200).json({    
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    avatar: req.user.avatar
  });
};