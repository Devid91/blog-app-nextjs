import mongoose, { Document, Model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import isURL from "validator/lib/isURL";
import sanitize from "mongo-sanitize";

interface IUser extends Document {
  email: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => isEmail(value),
        message: "Invalid email format.",
      },
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => isLength(value, { min: 1, max: 30 }),
        message: "Name must be between 1 and 30 characters.",
      },
    },
    username: {
      type: String,
      default: null,
      validate: {
        validator: async function (value: string | null) {
          if (!value) return true;
          const count = await UserModel.countDocuments({
            username: sanitize(value),
          });
          return count === 0;
        },
        message: "Username already exists.",
      },
    },
    avatar: {
      type: String,
      default: null,
      validate: {
        validator: (value: string | null) =>
          !value || isURL(value, { protocols: ["http", "https"] }),
        message: "Invalid URL for avatar.",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  // Sanitize email and name before saving
  this.email = sanitize(this.email);
  this.name = sanitize(this.name);
  if (this.username) {
    this.username = sanitize(this.username);
  }
  next();
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
