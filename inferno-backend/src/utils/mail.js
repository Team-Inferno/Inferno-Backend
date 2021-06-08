const Mailgun = require("mailgun-js");

var mailgun = new Mailgun({
  apiKey: process.env.EMAIL_SERVICE_API_KEY,
  domain: process.env.EMAIL_DOMAIN,
});

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};



