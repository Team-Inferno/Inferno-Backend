const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    transport.sendMail(data, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
