const mongoose = require("mongoose");
const { env } = require("./app");

const connect = async () => {
  const db = await mongoose.connect(
    `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}`
  );

  //   db.on("error", function (error) {
  //     console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
  //     db.close().catch(() =>
  //       console.log(`MongoDB :: failed to close connection ${this.name}`)
  //     );
  //   });

  //   db.on("connected", function () {
  //     mongoose.set("debug", function (col, method, query, doc) {
  //       console.log(
  //         `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
  //           query
  //         )},${JSON.stringify(doc)})`
  //       );
  //     });
  //     console.log(`MongoDB :: connected ${this.name}`);
  //   });

  //   db.on("disconnected", function () {
  //     console.log(`MongoDB :: disconnected ${this.name}`);
  //   });
};

try {
  connect();
  //   console.log("Database connected succesfully");
} catch (error) {
  console.log("Database cannot be connected: " + error);
}
