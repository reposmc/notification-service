const fs = require("fs");
const Handlebars = require("handlebars");
const { make } = require("simple-body-validator");

const { dispatchEmail } = require("../v1/emails.controller");

Handlebars.registerHelper("isdefined", function (value) {
  return value !== undefined;
});

const csvToJson = require("csvtojson");
const path = require("path");
const Queue = require("../../../models/Queue");

const pathTemplate = path.join(
  __dirname,
  "../../../../assets/templates/mail-template.html"
);

// Creates reusable rules object using the validator
const rulesTemplate = {
  title: "required",
  text: "required",
};

const rulesEmail = {
  to: "required",
  subject: "required",
};

// Create reusable transporter object using the default SMTP transport
const renderTemplate = (filename, data) => {
  var source = fs.readFileSync(filename, "utf8").toString();
  var template = Handlebars.compile(source);
  var output = template(data);
  return output;
};

/**
 * Validates the data coming from the request to render the template
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createDataTemplate = (req, res) => {
  const dataTemplate = {
    title: req.body.title,
    introduction: req.body.introduction,
    buttonText: req.body.buttonText,
    text: req.body.text,
    url: req.body.url,
    urlText: req.body.urlText,
    urlImage: req.body.urlImage,
    applicationName: req.body.applicationName,
    year: new Date().getFullYear(),
  };

  const validator = make(dataTemplate, rulesTemplate);

  //   Validates the form
  if (!validator.validate()) {
    return { errors: validator.errors().all(), data: null };
  }

  return {
    errors: null,
    data: dataTemplate,
  };
};

/**
 * Validates the info of the user where the email will be sent
 * @param {*} req
 * @param {*} res
 * @param {*} rules
 * @returns
 */
const createDataEmail = (req, res, rules) => {
  let email = {
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: "", // html body
    attachments: req.body.attachments ?? [],
  };

  const validator = make(email, rules);

  if (!validator.validate()) {
    // res.status(400).json();
    return { errors: validator.errors().all(), data: null };
  }

  return {
    errors: null,
    data: email,
  };
};

/**
 * Send an email soon as received.
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} res
 */
const sendEmailFromTemplate = async (req, res) => {
  console.log(req.body);
  try {
    // Validating data of the email
    const dataTemplate = createDataTemplate(req, res);

    if (dataTemplate.errors) {
      return res.status(200).json({
        message: dataTemplate.errors,
      });
    }

    // Renders the info in the email
    const html = renderTemplate(pathTemplate, dataTemplate.data);

    // Validates the info of the email
    const email = createDataEmail(req, res, rulesEmail);
    if (email.errors) {
      return res.status(200).json({
        message: email.errors,
      });
    }

    email.data.html = html;

    // Sending the email
    await dispatchEmail(email.data);

    return res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: error,
    });
  }
};

/**
 * Add the emails to the queue to send it later.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEmailToQueueFromTemplate = async (req, res) => {
  try {
    const dataTemplate = createDataTemplate(req, res);
    if (dataTemplate.errors) {
      return res.status(200).json({
        message: dataTemplate.errors,
      });
    }

    const html = renderTemplate(pathTemplate, dataTemplate.data);

    const email = createDataEmail(req, res, rulesEmail);
    if (email.errors) {
      return res.status(200).json({
        message: email.errors,
      });
    }
    email.data.html = html;

    await Queue.create([email.data]);

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
const addListEmailsToQueueFromTemplate = async (req, res) => {
  try {
    const dataTemplate = createDataTemplate(req, res);
    if (dataTemplate.errors) {
      return res.status(200).json({
        message: dataTemplate.errors,
      });
    }

    const html = renderTemplate(pathTemplate, dataTemplate.data);

    // Creating the array of mailables
    let emailsToQueue = [];
    req.body.emails.forEach((email) => {
      let emailData = {
        to: email, // list of receivers
        subject: req.body.subject, // Subject line
        html: html, // html body
        attachments: req.body.attachments ?? [],
      };

      const validator = make(emailData, { subject: "required" });

      if (!validator.validate()) {
        return res.status(400).json(validator.errors().all());
      }

      emailsToQueue.push(emailData);
    });

    // Adding emails to queue
    await Queue.insertMany(emailsToQueue);

    const totalEmailsAdded = req.body.emails.length;

    return res.status(200).json({
      message: "Messages added to queue successfully",
      data: {
        totalEmailsAdded: totalEmailsAdded,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 *
 * Reads a csv file to then sent the files of mails to the queue.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEmailsToQueueFromCsvFromTemplate = async (req, res) => {
  try {
    // Getting the data from the file
    const csvData = req.files.data.data.toString("utf8");
    const emails = await csvToJson().fromString(csvData);

    // Render template
    const dataTemplate = createDataTemplate(req, res);
    const html = renderTemplate(pathTemplate, dataTemplate.data);

    // Create objects of emails
    let data = [];
    emails.forEach(async (email) => {
      let emailData = {
        to: email.to, // list of receivers
        subject: req.body.subject, // Subject line
        html: html, // html body
        attachments: req.body.attachments ?? [],
      };
      const validator = make(emailData, rulesEmail);
      if (!validator.validate()) {
        return res.status(400).json(validator.errors().all());
      }
      data.push(emailData);
    });

    // Add the queue
    await Queue.insertMany(data);

    return res.status(200).json({
      message: "Messages added to queue successfully",
      data: {
        totalEmailsAdded: emails.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  pathTemplate,
  rulesEmail,

  createDataTemplate,
  renderTemplate,
  createDataEmail,
  dispatchEmail,
  sendEmailFromTemplate,
  addEmailToQueueFromTemplate,
  addListEmailsToQueueFromTemplate,
  addEmailsToQueueFromCsvFromTemplate,
};
