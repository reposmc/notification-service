const cron = require("node-cron");
const mail = require("./config/mail");
const {
  getEmailsQueue,
} = require("./app/controllers/emails/v1/emails.controller");

cron.schedule(mail.cronJob, async () => {
  try {
    console.log("---------------------");
    const totalEmails = await getEmailsQueue();
    console.log(
      `Dispatching ${totalEmails} emails. Limit: ${mail.emailsToBeSent} emails.`
    );
  } catch (error) {
    console.log("Error: " + error.message);
  }
});
