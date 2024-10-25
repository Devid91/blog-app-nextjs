// "use server";

// import mongoose, { Schema } from "mongoose";

// const userSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     username: {
//       type: String,
//       require: true,
//       unique: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// export default UserModel;

// /models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
