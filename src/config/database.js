const mongoose = require("mongoose");
const { env } = require("./app");

const connect = async () => {
  const db = await mongoose.connect(
    `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}`
  )
};

try {
  connect();
  console.log("Database connected succesfully");
} catch (error) {
  console.log("Database cannot be connected: " + error);
}
