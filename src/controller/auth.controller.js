const User = require("../model/user.model");
const Token = require("../model/token.model");
const sendMail = require("../utils/mail");

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    // Make sure this account doesn't already exist
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        error: {
          email:
            "The email address you have entered is already associated with another account.",
        },
      });
    }

    const newUser = new User({ ...req.body });

    await sendVerificationEmail(newUser, req, res);

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "A verification email has been sent to " + newUser.email + ".",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
};

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        error: {
          email:
            "The email address " +
            email +
            " is not associated with any account. Double-check your email address and try again.",
        },
      });

    if (!user.isVerified)
      return res.status(401).json({
        error: {
          email: "Your email has not been verified.",
        },
      });

    //validate password
    if (!user.comparePassword(password))
      return res
        .status(401)
        .json({ error: { password: "Incorrect password" } });

    // Make sure the user has been verified

    // Login successful, write token, and send back user
    res
      .status(200)
      .json({ success: true, jwt: user.generateJWT(), user: user });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// ===EMAIL VERIFICATION
// @route GET api/verify/:token
// @desc Verify token
// @access Public
exports.verify = async (req, res) => {
  if (!req.params.token)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token)
      return res.status(400).json({
        message:
          "We were unable to find a valid token. Your token may have expired.",
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token.userId }, (err, user) => {
      if (!user)
        return res
          .status(400)
          .json({ message: "We were unable to find a user for this token." });

      if (user.isVerified)
        return res
          .status(400)
          .json({ message: "This user has already been verified." });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) return res.status(500).json({ message: err.message });

        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST api/resend
// @desc Resend Verification Token
// @access Public
exports.resendToken = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message:
          "The email address " +
          req.body.email +
          " is not associated with any account. Double-check your email address and try again.",
      });

    if (user.isVerified)
      return res.status(400).json({
        message: "This account has already been verified. Please log in.",
      });

    await sendVerificationEmail(user, req, res);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

async function sendVerificationEmail(user, req, res) {
  const token = user.generateVerificationToken();

  let subject = "Account Verification";
  let to = user.email;
  let from = process.env.FROM_EMAIL;
  let link = "http://" + req.headers.host + "/api/auth/verify/" + token.token;
  let html = `<p>Hi ${user.username}<p><br><p>Please click on the following link: <br><a href=${link}>${link}</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;
  let mailData = { to, from, subject, html };
  await sendMail(mailData);

  await token.save();
}
