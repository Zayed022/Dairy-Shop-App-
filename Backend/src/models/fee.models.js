import mongoose, {Schema} from "mongoose";

const feeConfigSchema = new Schema({
    deliveryCharge:{
        type: Number,
        required: true,
        default: 0,
    },
    handlingFee:{
        type:Number,
        required: true,
        default: 0,
    },
    isActive:{
        type: Boolean,
        index: true,
    },
},{timestamps: true});

export const FeeConfig = mongoose.model("FeeConfig",feeConfigSchema)