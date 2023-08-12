const mail = {
  /**
   *
   * Mail configuration for nodemailer.
   *
   */
  nodemailer: {
    pool: true,
    host: process.env.MAIL_HOST, // sender address
    port: process.env.MAIL_PORT * 1,
    secure: process.env.MAIL_SECURE == "true", // true for 465, false for other ports
    maxConnections: 5,
    maxMessages: Infinity,
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
  emailsToBeSent: process.env.EMAILS_TO_BE_SENT || 15,

  /**
   *
   *
   *
   */
  cronJob: process.env.CRON_JOB,
};

module.exports = mail;
