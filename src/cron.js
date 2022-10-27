const cron = require("node-cron");
const mail = require("./config/mail");
const { getEmailsQueue } = require("./app/controllers/emails.controller");

cron.schedule(mail.cronJob, async () => {
    try {
        console.log("---------------------");
        const totalEmails = await getEmailsQueue();
        console.log(`Dispatching ${totalEmails} emails`);
    } catch (error) {
        console.log("Error: " + error.message);
    }
});
