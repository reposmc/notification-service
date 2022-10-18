const nodemailer = require("nodemailer");
const mail = require("../../config/mail");
const Queue = require("../models/Queue");

const csvToJson = require("csvtojson");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(mail.nodemailer);

const dispatchEmail = async (email) => {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: mail.mailFrom, // sender address
    to: email.to, // list of receivers
    subject: email.subject, // Subject line
    html: email.html, // html body
    attachments: email.attachments,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const sendEmail = async (req, res) => {
  let email = {
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: req.body.html, // html body
    attachments: req.body.attachments ?? [],
  };

  await dispatchEmail(email);

  return res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
};

const addEmailToQueue = async (req, res) => {
  try {
    console.log(req.body.attachments);
    await Queue.insertMany({
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.html, // html body
      attachments: req.body.attachments ?? [],
    });

    return res.status(200).json({
      success: true,
      message: "Messages added to queue successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Email cannot be added. Error: " + error.message,
    });
  }
};

const addListEmailsToQueue = async (req, res) => {
  // Adding emails to queue
  await Queue.insertMany(req.body.emails);

  const totalEmailsAdded = req.body.emails.length;

  return res.status(200).json({
    success: true,
    message: "Messages added to queue successfully",
    data: {
      totalEmailsAdded: totalEmailsAdded,
    },
  });
};

const dispatchEmails = async (req, res) => {
  try {
    const totalEmails = await getEmailsQueue();

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        totalEmailsSent: totalEmails,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Email cannot be sent. Error: " + error.message,
    });
  }
};

const getEmailsQueue = async () => {
  const emails = await Queue.find().limit(mail.emailsToBeSent);

  emails.forEach(async (email) => {
    await dispatchEmail(email);

    await email.deleteOne();
  });

  return emails.length;
};

const addEmailsToQueueFromCsv = async (req, res) => {
  const csvData = req.files.data.data.toString("utf8");

  const emails = await csvToJson().fromString(csvData);

  let data = [];
  emails.forEach(async (email) => {
    data.push({
      to: email.to, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.html, // html body
      attachments: req.body.attachments ?? [],
    });
  });

  await Queue.insertMany(data);

  return res.status(200).json({
    success: true,
    message: "Messages added to queue successfully",
    data: {
      totalEmailsAdded: emails.length,
    },
  });
};

module.exports = {
  sendEmail,
  addEmailToQueue,
  addListEmailsToQueue,
  dispatchEmails,
  addEmailsToQueueFromCsv,
  getEmailsQueue,
};
