import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { Roles } from "../types/roles.enum";
import { User } from "../types/user.type";
import { AuthSchemaNames } from "../types/auth-schema-names.enum";

const userSchema = new Schema<User>({
    name: {
        type: String,
        trim: true,
        match: [/^[\p{L}\p{M}\p{Zs}'\-]+$/u, "Please, insert valid characters for your name."]
    },
    surname: {
        type: String,
        trim: true,
        match: [/^[\p{L}\p{M}\p{Zs}'\-]+$/u, "Please, insert valid characters for your surname."]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "The given email is not valid."]
    },
    username: {
        type: String,
        required: [true, "The username is required."],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9_]{3,16}$/, "The username is not valid."]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long, include a number, a special character, an uppercase character and a lowercase character."]
    },
    role: {
        type: String,
        enum: Object.values(Roles),
        default: Roles.USER
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    birthday: Date,
    country: String,
    description: {
        type: String,
        maxlength: [500, "The description max length is 500 characters."],
        trim: true
    },
    profilePic: String
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const hashedPsw: string = await bcrypt.hash(user.password, 12);
    user.password = hashedPsw;
});

export const UserModel = model(AuthSchemaNames.USER, userSchema);

UserModel.syncIndexes();