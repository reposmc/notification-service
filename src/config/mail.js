const mail = {
  /**
   *
   * Mail configuration for nodemailer.
   *
   */
  nodemailer: {
    host: process.env.MAIL_HOST, // sender address
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  },

  /**
   *
   * Email adress where the emails where be sent.
   *
   */
  mailFrom: process.env.MAIL_FROM,

  /**
   *
   * Total emails to be sent each dispatch.
   *
   */
  emailsToBeSent: process.env.MAILS_TO_BE_SENT,

  /**
   *
   *
   *
   */
  cronJob: process.env.CRON_JOB,
};

module.exports = mail;
