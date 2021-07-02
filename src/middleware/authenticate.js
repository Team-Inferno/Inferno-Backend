const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", function (err, user, info) {
    if (err) return next(err);

    if (!user)
      return res
        .status(401)
        .json({ message: "Unauthorized Access - No Token Provided!" });

    req.user = { id: user._id, username: user.username, email: user.email };

    next();
  })(req, res, next);
};
