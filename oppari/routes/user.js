const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/User");
const nodemailer = require("nodemailer");

/**
 * @method - POST
 * @param - /register
 * @description - User Registration
 */
router.post(
  "/register",
  [
    check("email", "Please enter a valid email").isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email } = req.body;

    var password = Math.random().toString(36).slice(-8);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tuntikirjanpitojarjestelma@gmail.com',
                pass: ''
            }
        });

        var mailOptions = {
          from: 'Ajanvarausjärjestelmä',
          to: email,
          subject: 'Uusi käyttäjä palvelussa Tuntikirjanpitojärjestelmä',
          html: '<h1>Tervetuloa uusi käyttäjä!</h1> <br> <p>Käyttäjätunnus: ' + email + '<br> salasana: ' + password + ' </p><br>'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error){
            //console.log(error);
        }
        else {
            //console.log('Email sent: ' + info.response);
        }
    });

    
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "Käyttäjää ei ole olemassa",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Väärä salasana!",
        });

      const payload = {
        user: {
          id: user.id,
          admin: user.admin
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    //console.log(user.email);
    res.json({
      response: req.user.id,
      email: user.email,
      admin: user.admin
    });
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.post(
  "/reset",
  [
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password, newPassword, ConfirmnewPassword } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if(!user) {
        console.log("ei löydy käyttäjää");
        return res.status(400).json({
          message:"Käyttäjää ei löydy",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch){
        console.log("Väärä salasana");
        return res.status(400).json({
          message: "Väärä salasana!",
        });
      }
      if (user) {
        if(newPassword === ConfirmnewPassword){
        const isMatch = true;
        if (!isMatch){
          return res.status(400).json({
            message: "Salasanan varmistus väärin!",
          });
        }
        else if(isMatch){
          //User.changeUserPassword(user.email, user.newPassword)
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(newPassword, salt);
          await user.save();
          //console.log("salasanat mätsää");
          res.status(200).json({
            successMessage: "Salasanan vaihtaminen onnistui"
          });
        }
        
      }
    } else {
      console.log("salasanat eivät mätsää");
    }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);


router.get("/getall", async (req, res) => {

  var query = User.find({}).select("email");

  query.exec(function (err, data) {
    if (err) return (err);
    //console.log(data);
    res.send(data);
  })

})


module.exports = router;
