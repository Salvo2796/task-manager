const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {type:String, required:true, trim:true, match: /.+\@.+\..+/, unique: true, lowercase: true},
        passwordHash: {type:String, required:true},
        nome:{type:String, trim:true},
        role: {type: String, enum: ["user", "admin"]}
    }, 
    {
        timestamps:true
    }
);

userSchema.set("toJSON", {
    transform: (doc,ret) => {
        delete ret.passwordHash;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);