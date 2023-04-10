const nodemailer = require("nodemailer");
const mail = require("../../../../config/mail");
const Queue = require("../../../models/Queue");
const Handlebars = require("handlebars");
const fs = require("fs");

Handlebars.registerHelper("isdefined", function (value) {
  return value !== undefined;
});

const csvToJson = require("csvtojson");
const path = require("path");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(mail.nodemailer);

/**
 * Dispatch the email to the sender.
 *
 * @param {*} email
 */
const dispatchEmail = async (email) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};

/**
 * Send an email soon as received.
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} res
 */
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

/**
 * Add the emails to the queue to send it later.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEmailToQueue = async (req, res) => {
  try {
    await Queue.create([
      {
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        html: req.body.html, // html body
        attachments: req.body.attachments ?? [],
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Messages added to queue successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Email cannot be added. Error: " + error.message,
    });
  }
};

/**
 *
 * Adds an array of emails to the queue.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addListEmailsToQueue = async (req, res) => {
  // Creating the array of mailables
  let emailsToQueue = [];
  req.body.emails.forEach((email) => {
    emailsToQueue.push({
      to: email, // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.html, // html body
      attachments: req.body.attachments ?? [],
    });
  });

  // Adding emails to queue
  await Queue.insertMany(emailsToQueue);

  const totalEmailsAdded = req.body.emails.length;

  return res.status(200).json({
    success: true,
    message: "Messages added to queue successfully",
    data: {
      totalEmailsAdded: totalEmailsAdded,
    },
  });
};

/**
 *
 * Dispatch the next emails in the queue to be sent.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
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

/**
 * Get from DB the next mails to be sent and dispatch them.
 *
 * @returns
 */
const getEmailsQueue = async () => {
  const emails = await Queue.find().limit(mail.emailsToBeSent);

  emails.forEach(async (email) => {
    await dispatchEmail(email);

    await email.deleteOne();
  });

  return emails.length;
};

/**
 *
 * Reads a csv file to then sent the files of mails to the queue.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
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
  dispatchEmail,
  sendEmail,
  addEmailToQueue,
  addListEmailsToQueue,
  dispatchEmails,
  addEmailsToQueueFromCsv,
  getEmailsQueue,
};
