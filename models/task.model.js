const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
        image: {
           
            originalName: { type: String},
            
            storedName: { type: String},
            
            path: { type: String},
           
            mimetype: { type: String},
            
            size: { type: Number},
        },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Task", taskSchema);