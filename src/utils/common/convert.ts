import mongoose from 'mongoose';

const convertStringToObjectId = (value: string) => new mongoose.Types.ObjectId(value);

export { convertStringToObjectId };
