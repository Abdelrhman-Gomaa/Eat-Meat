const bcrypt = require('bcrypt');
const {User} = require('../Models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const CodeGenerator = require("node-code-generator");

// Open Your Profile
exports.profile = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
};

// Authentiction User "Sign In"
exports.logIn = async (req, res, next) => {
    try{
        // validation sign in
        const {error} = login(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        User.findOne({email: req.body.email})
            .then(user =>{
                if(!user){
                    return res.status(404).json({
                        message: 'This Mail is Not Found...'
                    });
                }
                bcrypt.compare(req.body.password, user.password, async(err, result)=>{
                    if(err){
                        return res.status(401).json({
                            message: "Auth Failed..."
                        });
                    }
                    if(result){
                        const token = req.header('Authorization')
                        if (token) return res.status(401).send(`Access Denaied ... `)
                        else{
                        // AuthToken ...
                        token = jwt.sign(
                            {_id: user._id, email: user.email},
                            process.env.JWT
                            );  
                        res.header('Authorization',token)
                        return res.status(200).json({
                            message: 'You are Login Now...',
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: 'password is incorrect...'
                    });
                }})
            })
            .catch(err =>{
                res.status(500).json({
                    error: err.message
                })
            });
    }catch(error){
        next(error)
    }
};

// Register New User
exports.rgister = async (req, res, next) => {
    try{
        const {error} = register(req.body)
        if(error) return res.status(400).send(error.details[0].message)
    
        User.findOne({email: req.body.email})
            .then(user =>{
                if(user){
                    return res.status(409).json({
                        message: 'This Mail is aleardy Register...'
                    });
                }else{
                    // to incryption password ....
                    bcrypt.hash(req.body.password, 10, async (err, hash) =>{
                        if(err){
                            return res.status(500).json({
                                error: err
                            });
                        }else{
                            const users = new User ({
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                phoneNum: req.body.phoneNum,
                                picName: req.files[0].originalname,
                                url: req.files[0].path,
                                location: req.body.location,
                                isAdmin: req.body.isAdmin
                            });
                            await users
                                .save()
                                .then(result =>{
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'User Created..',
                                        name: result.name,
                                        password: result.password
                                    });
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err.message
                                    })
                                });
                        }
                    });
                }
            })
    }catch(error){
        next(error)
    }
};

// Google && Facebook Auth 
exports.Oauth = async (req, res, next) => {
    try {
      delete isAdmin;
      const token = jwt.sign(
            {_id: user._id, email: user.email},
            process.env.JWT
        );
      res.status(200).send({ user: req.user, token });
    } catch (error) {
      next(error);
    }
};

// Send code to verify 
exports.sendCode = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("Invalid email");
  
    var generator = new CodeGenerator();
    const code = generator.generateCodes("#+#+#+", 100)[0];
  
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verfication Code",
      text: `Reset password code ${code}`,
    };
  
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        res.status(400).send(error);
      } else {
        req.body.codeVerifing = code;
        await user.set(req.body).save();
        res.status(200).send(`Email sent: ${info.response}`);
      }
    });
    
};
  
// Code Verifing
exports.codeVerifing = async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User with the given email not exits");
    }
  
    try {
      if (user.codeVerifing == req.body.code) {
        user.enabled = true;
        user.codeVerifing = "";
        user = await user.save();
        res.status(200).send(user);
      }
    } catch (error) {
      next(error);
    }
}

// Forget Your Password
exports.forgetPassword = async (req, res, next) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).send("Invalid email");
  
      if (user.codeVerifing === req.body.code) {
        user.password = await bcrypt.hash(req.body.newPassword, 10);
        user.codeVerifing = "";
        user = await user.save();
        res.status(200).send(user);
      }
    } catch (error) {
      next(error);
    }
};

// Change your Password
exports.changePassword = async (req, res, next) => {
    try {
      const compare = await bcrypt.compare(
        req.body.oldPassword,
        req.user.password
      );
      if (!compare) return res.status(400).send("Incorrect password");
  
      req.user.password = await bcrypt.hash(req.body.newPassword, 10);
      req.user = await req.user.save();
      res.status(200).send(req.user);
    } catch (error) {
      next(error);
    }
};
 
// Edit Profile (Update)
exports.editProfile = async (req, res, next) => {
    try {
      let img;
      if (req.files.length !== 0) {
        img = await cloud.cloudUpload(req.files[0].path);
        req.body.image = img.image;
      }
  
      delete req.body.isAdmin;
      delete req.body.codeVerifing;
      delete req.body.password;
  
      if (req.body.lng || req.body.lat) {
        req.body.location = {
        coordinates:[req.body.lng, req.body.lat]
      }}
      await req.user.set({...req.body}).save();
  
      if (req.files.length !== 0) fs.unlinkSync(req.files[0].path);
      res.status(200).send(req.user);
    } catch (error) {
      next(error);
    }
};
  
// Delete Account
exports.deleteAccount = async (req, res, next) => {
    try {
      await req.user.delete();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
};
  
// Model Validation by Joi package to validate Login Request ....
function login(user){
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().required(),
    });
    return schema.validate(user)
}

// Model Validation by Joi package to validate Register Request ....
function register(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        picString: Joi.string(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean().required(),
        phoneNum: Joi.string().required(),
        location: Joi.string().required(),  
    });
    return schema.validate(user)
}