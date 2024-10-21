import { model, Schema } from "mongoose";
import { SignOptions } from "../types/sign-options.enum";
import { AuthSchemaNames } from "../types/auth-schema-names.enum";
import { SignOption } from "../types/sign-option.type";

const signOptionsSchema = new Schema<SignOption>({
    option: {
        type: String,
        immutable: true,
        required: true,
        unique: true,
        enum: Object.values(SignOptions)
    }
});

export const SignOptionsModel = model(AuthSchemaNames.SIGN_OPTIONS, signOptionsSchema);