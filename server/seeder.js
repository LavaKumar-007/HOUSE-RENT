const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const Property = require("./models/Property");

const properties = require("./data/properties");

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await Property.deleteMany();

    await Property.insertMany(properties);

    console.log("Properties Imported Successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();