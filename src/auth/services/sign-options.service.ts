import { SignOptionsModel } from "../models/sign-options.model"
import { SignOption } from "../types/sign-option.type";
import { SignOptions } from "../types/sign-options.enum"

export const signOptionsInit = async (): Promise<void> => {
    const options: SignOption[] = Object.values(SignOptions).map(opt => ({ option: opt }));

    const existingOptions = await SignOptionsModel.find({ option: { $in: Object.values(SignOptions) } });

    const existingValues = existingOptions.map(opt => opt.option);

    const newOptions = options.filter(opt => !existingValues.includes(opt.option));

    await SignOptionsModel.insertMany(newOptions);
}