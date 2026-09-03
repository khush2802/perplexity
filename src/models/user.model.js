
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
     username:{
          type:String,
          required:[true,"Please provide a username"],
          unique:true,
          trim:true,
     },

     email:{
          type:String,
          required:[true,"Please provide an email"],
          unique:true,
          trim:true,
          lowercase:true,     
     },

     password:{
          required:[true,"Please provide a password"],
          type:String,
          minLength:[6,"Password should be greater than 6 characters"],
     },

     verified:{
          type:Boolean,
          default:false,
     }
},{
     timestamps:true,
});


userSchema.pre("save", async function(){
     if(!this.isModified("password")){
          return ;
     }
     this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(enteredPassword){
     return await bcrypt.compare(enteredPassword, this.password);
}

const userModel = mongoose.model("user", userSchema);

export default userModel;