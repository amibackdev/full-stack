import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Заоголовок задачи обязателен"], 
        trim: true
    },
    deadline:{
        type: Number,
        required: [true, "Дедлайны задачи обязательны"], 
    },
    priority:{
        type: String,
        required: [true, "Приоритеты задачи обязательны"], 
    },
    description:{
        type: String,
        required: [true, "Дедлайны задачи обязательны"], 
    },
    photo:{
        type: String
    }
})

export default mongoose.model("tracker", trackerSchema)