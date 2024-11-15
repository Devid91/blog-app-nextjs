import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface for the User document
interface IUser extends Document {
  email: string;
  name: string;
  username: string | null;
  avatar?: string;
}

// Define User Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB and Mongoose will enforce unique constraint
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: null,
      validate: {
        // Custom validator to allow multiple null values, but enforce uniqueness if username is not null
        validator: async function (value: string | null) {
          if (!value) return true; // Allows multiple `null` or empty values

          // If username is not null, check for uniqueness
          const count = await UserModel.countDocuments({ username: value });
          return count === 0;
        },
        message: "Username already exists.",
      },
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the User Model
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
