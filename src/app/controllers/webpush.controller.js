const webpush = require("web-push");
const wbp = require("../../webpush");
const Notifiable = require("../models/Notifiable");
const { make } = require("simple-body-validator");

const subscribe = async (req, res) => {
  try {
    let pushSuscription = req.body.dataSuscription;

    const notifiable = Notifiable.findOne({
      endpoint: pushSuscription.endpoint,
    });

    if (!notifiable) {
      const newNotifiable = new Notifiable(pushSuscription);

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
      message: req.body.message,
      image: "../../assets/logo.png",
      tag: req.body.tag,
      url: req.body.url,
    };
    const rules = {
      title: "required",
      message: "required",
    };

    const validator = make(data, rules);
    if (!validator.validate()) {
      return res.status(400).json(validator.errors().all());
    }

    const notifiables = await Notifiable.find();
    const payload = JSON.stringify(data);

    notifiables.forEach(async (notifiable) => {
      await webpush.sendNotification(notifiable, payload);
    });

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  subscribe,
  sendNotification,
};
