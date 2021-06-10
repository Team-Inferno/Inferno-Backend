const express = require("express");
const { check } = require("express-validator");

const Auth = require("../controller/auth.controller");
const Password = require("../controller/password.controller");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", (req, res) => {
  res
    .status(200)
    .json({
      message:
        "You are in the Auth Endpoint. Register or Login to test Authentication.",
    });
});

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("username")
      .not()
      .isEmpty()
      .withMessage("username is required"),
  ],
  validate,
  Auth.register
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty(),
  ],
  validate,
  Auth.login
);

//EMAIL Verification
router.get("/verify/:token", Auth.verify);
router.post("/resend", Auth.resendToken);

//Password RESET
router.post(
  "/recover",
  [check("email").isEmail().withMessage("Enter a valid email address")],
  validate,
  Password.recover
);

//reset page
router.get("/reset/:token", Password.reset);


router.post(
  "/reset/:token",
  [
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("confirmPassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  validate,
  Password.resetPassword
);

module.exports = router;
