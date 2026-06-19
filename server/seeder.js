const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Property = require("./models/Property");
const Booking = require("./models/Booking");

const usersData = require("./data/users");
const propertiesData = require("./data/properties");

dotenv.config();

const importData = async () => {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.SEED_FORCE) {
      console.error("Seeding blocked in production. Set SEED_FORCE=true to override.");
      process.exit(1);
    }

    await connectDB();

    await Booking.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    const userMap = {};

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      userMap[userData.email] = user._id;
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    const createdProperties = [];

    for (const prop of propertiesData) {
      const { ownerEmail, ...propertyFields } = prop;
      const property = await Property.create({
        ...propertyFields,
        owner: userMap[ownerEmail],
      });
      createdProperties.push(property);
      console.log(`Created property: ${property.title}`);
    }

    await Booking.create({
      property: createdProperties[0]._id,
      tenant: userMap["sneha@househunt.com"],
      owner: userMap["rahul@househunt.com"],
      moveInDate: new Date("2026-07-01"),
      message: "Looking for a long-term rental. Working at Hitech City.",
      status: "approved",
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\n--- Demo Accounts ---");
    console.log("Admin:  admin@househunt.com  / Admin@123");
    console.log("Owner:  rahul@househunt.com   / Owner@123");
    console.log("Tenant: sneha@househunt.com  / Tenant@123");
    console.log("---------------------\n");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
