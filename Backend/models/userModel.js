const mongoose = require("mongoose");
const { notificationSchema } = require("./notificationSchema");
const { autoIncrement } = require("mongoose-plugin-autoinc");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "Please Type A User Name!"],
      validate: {
        validator: function (v) {
          // Validation regex for user_name
          let regex = new RegExp(
            "^(?=[a-zA-Z0-9._ ]{10,35}$)(?!.*[_.]{2})[^_.].*[^_.]$"
            /* No _ or . at the beginning
            No __ or _. or ._ or .. inside 
            No _ or . at the end
            [a-zA-Z0-9._] >> allowed characters
            Username is {10-35} characters long
            */
          );
          return regex.test(v);
        },
        message: "Please Enter A Valid User Name!",
      },
    },
    email: {
      type: String,
      required: [true, "Please Type An Email!"],
      unique: true,
      validate: {
        validator: function (v) {
          // Validation regex for email
          let regex = new RegExp(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            /* Match email with valid format */
          );
          return regex.test(v);
        },
        message: "Please Enter A Valid Email!",
      },
    },
    password: {
      type: String,
      required: [true, "Please Type A Password!"],
    },
    phone: {
      type: String,
      required: [true, "Please Type A Phone Number!"],
      unique: true,
      // Removed validation for phone number
    },
    full_address: {
      type: String,
      required: [true, "Please Type An Address!"],
    },
    zip_code: {
      type: String,
      required: [true, "Please Type A Zip/Postal Code!"],
      // Removed validation for zip/postal code
    },
    role: {
      type: String,
      default: "Client",
      immutable: true,
    },
    user_status: {
      type: Number,
      default: 0, //active, 1 >> inactive, 2 >> suspended
    },
    no_of_account: {
      type: Number,
      default: 0,
      max: [
        3,
        "Sorry, You Can Not Add More Than 3 Accounts in your Bank Profile",
      ],
    },
    accounts: [String],
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

// Handle duplicate 'Key' error when 'SAVING' a User
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    let dupKeys = Object.keys(error.keyPattern);
    next(new Error(`This ${dupKeys.join(", ")} is Already Used By Another User!`));
  } else {
    next();
  }
});

// Handle duplicate 'Key' error when 'UPDATING' a User
userSchema.post("updateOne", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    let dupKeys = Object.keys(error.keyPattern);
    next(new Error(`This ${dupKeys.join(", ")} is Already Used By Another User!`));
  } else {
    next();
  }
});

// Auto Increment Users ID Plugin
userSchema.plugin(autoIncrement, {
  model: "User",
  startAt: 2525500300,
  incrementBy: 1,
});

// Define User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
