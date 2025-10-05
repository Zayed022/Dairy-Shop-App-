import mongoose, {Schema} from "mongoose";

const productsSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    unit:{
        type: String,
        default: "",
        required: true,
    },
    image:{
        type: String,
    },
    category:{
        type: String,
        enum:["Dairy","Bread", "Eggs","Others"],
        required: true,
    },
    stock:{
        type: Number,
        default: 10,
    },
},{timestamps: true});

export const Product = mongoose.model("Product",productsSchema)