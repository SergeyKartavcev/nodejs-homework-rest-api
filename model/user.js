const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: "",
  },
  owner: {
   type: [mongoose.Types.ObjectId] ,
  rel: "user"
  },
  
});


const User = mongoose.model("user", userSchema );

module.exports = {
    User
}