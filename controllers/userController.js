const Media = require("../models").Media;
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Profile = require("../models").Profile;
const { S3 } = require("@aws-sdk/client-s3");


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

  const user = await User.findOne({ where: { id: req.user.id } });   
  if (!user) return res.status(409).json({ "message": "Такой пользователь не существует" });
  
  const userUpdateData = {};

  if (firstName !== user.firstName) {
    userUpdateData.firstName = firstName
  }
  if (lastName !== user.lastName) {
    userUpdateData.lastName = lastName
  }
  if (newPassword  
    && newPassword.length >0 
    && password 
    && password.length >0 
    ) {

      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const password = await bcrypt.hash(newPassword, 5);
        userUpdateData.password = password;
      }
    }
   
    if (Object.keys(userUpdateData).length !== 0) {
      await User.update(userUpdateData, {
        where: {
          id: req.user.id
        }
      });
    }

    const modelProfile = await Profile.findOne({ where: { userId: user.id}});

    if (modelProfile) {
      modelProfile.set({
        phone,
        description,
        latitude : latitude ? latitude : modelProfile.latitude,
        longitude: longitude ? longitude : modelProfile.longitude,
        commercial: !!commercial,
      })
      await modelProfile.save();
    }else {
       const modelProfile = Profile.build({
      userId: user.id,
      phone,
      description,
      latitude : latitude ? latitude : null,
      longitude: longitude ? longitude : null,
      commercial: !!commercial,
    });
 
    await modelProfile.save();   
  }    

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

exports.deleteAvatar = async (req, res) => {
  const avatar = await Media.findOne({ 
    where: { 
      model: 'User',
      modelId: req.user.userId,
      fieldName: 'avatar'
    } 
  });

  if (!avatar) return res.status(409).json({"message":  "Файл не существует"});

  const s3 = new S3({
    endpoint: process.env.AWS_HOST,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    sslEnabled: false,
    forcePathStyle: true,
  });

  try {
    await s3.deleteObject({ Bucket: process.env.AWS_BUCKET, Key: avatar.path});
    await avatar.destroy();

  } catch (error) {
    return res.status(400).json({"message":  error.message});
  }  

  return res.status(200).json({"message":  "Файл успешно удалён"});

};

exports.profile = async (req, res) => {

  const user = await User.findOne({
    where: { id: req.user.userId },
    attributes: ['id', 'firstName', 'lastName', 'email'],
    include: 'Profile'
  });  
  
  if (!user) return res.status(404).json({ "message": "Такой пользователь не найден" });

    const avatar = await Media.findOne({
      where: { 
        model: 'User',
        modelId: user.id,
        fieldName: 'avatar'
      }
    })

    let pathToAvatar = '';

    if (avatar) pathToAvatar = `https://instagram.lern.dev/storage/${avatar.path}`;  

  return res.status(200).json({    
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: pathToAvatar,
    phone: user.Profile.phone,
    description: user.Profile.description,
    latitude: user.Profile.latitude,
    longitude: user.Profile.longitude,
    commercial: user.Profile.commercial,
  });
};