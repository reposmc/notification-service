const { response } = require("express");
const webpush = require("web-push");
const wbp = require("../webpush");

const subscribe = async (req, res) => {
  try {
    let pushSuscription = req.body.dataSuscription;

    const payload = await JSON.stringify({
      title: req.body.title,
      message: req.body.message,
    });

    await webpush.sendNotification(pushSuscription, payload);
    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    return response.status(500).send(error);
  }
};

const sendNotification = async (req, res) => {
  try {
    let pushSuscription = req.body.dataSuscription;

    const payload = await JSON.stringify({
      title: req.body.title,
      message: req.body.message,
    });

    await webpush.sendNotification(pushSuscription, payload);
    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    return response.status(500).send(error);
  }
};

module.exports = {
  subscribe,
  sendNotification,
};
