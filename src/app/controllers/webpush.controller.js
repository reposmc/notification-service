const webpush = require("web-push");
const wbp = require("../../webpush");
const Notifiable = require("../models/Notifiable");
const { make } = require("simple-body-validator");
const path = require("path");
const {
  createDataTemplate,
  renderTemplate,
  createDataEmail,
  dispatchEmail,
  pathTemplate,
  rulesEmail,
} = require("./emails/v2/emails.controller");
const Queue = require("../models/Queue");

const subscribe = async (req, res) => {
  try {
    let pushSuscription = req.body.dataSuscription;

    // console.log(pushSuscription.endpoint);

    const notifiable = await Notifiable.findOne({
      endpoint: pushSuscription.endpoint,
    });

    if (!notifiable) {
      const newNotifiable = new Notifiable({
        ...pushSuscription,
        email: req.body.email,
      });

      await newNotifiable.save();
    }

    return res.status(200).json({
      success: true,
      message: "User subscribed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const sendNotification = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      text: req.body.text,
      image: path.join(__dirname, "../../assets/logo.png"),
      tag: req.body.tag,
      url: req.body.url,
      to: req.body.to,
      subject: req.body.subject,
      sendEmail: req.body.sendEmail ?? false,
    };

    const rules = {
      title: "required",
      text: "required",
      to: "required",
    };

    const validator = make(data, rules);
    if (!validator.validate()) {
      return res.status(400).json(validator.errors().all());
    }

    const notifiables = await Notifiable.find({ email: data.to });

    const payload = JSON.stringify({
      title: data.title,
      message: data.text,
      tag: data.tag,
      url: data.url,
    });

    for (let i = 0; i < notifiables.length; i++) {

      await webpush.sendNotification({
        endpoint: notifiables[i].endpoint,
        expirationTime: notifiables[i].expirationTime,
        keys: notifiables[i].keys,
      }, payload);
    }

    // Sending email
    let errors = [];
    if (req.body.sendEmail) {
      const response = await sendEmailFromWebpush(req, res);
      errors = response.errors ?? [];
    }

    if (!errors || errors.length == 0) {
      return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        errors,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const sendEmailFromWebpush = async (req, res) => {
  // Validating data of the email
  const dataTemplate = createDataTemplate(req, res);

  if (dataTemplate.errors) {
    return { success: false, errors: dataTemplate.errors };
  }

  // Renders the info in the email
  const html = renderTemplate(pathTemplate, dataTemplate.data);

  // Validates the info of the email
  const email = createDataEmail(req, res, rulesEmail);

  if (email.errors) {
    return {
      success: false,
      errors: email.errors,
    };
  }
  email.data.html = html;

  // Sending the email
  // await dispatchEmail(email.data);
  await Queue.create([email.data]);

  return {
    success: true,
    errors: null,
  };
};

module.exports = {
  subscribe,
  sendNotification,
};
