const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be less than 30 characters"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      require: true,
    },
    gender: {
      type: String,
      enum: {
        values:["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      require: true,
    },
    phone: {
      type: Number,
      unique: true, 
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"], //
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Excludes password from query results by default
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
//     const hashedPassword = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
//     this.password=hashedPassword
//     next();
//   });

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.hash(this.password, 10).then((hash) => {
        this.password = hash; 
        next();
    }).catch((err) => {
        next(err);
    });
});

userSchema.methods.getJWT=async function(){
  const user=this;

  const token=await jwt.sign({_id:user._id},'mysecreatetoken',{
    expiresIn: "15m"
  })
  return token
}

userSchema.methods.getJWTRefreshToken=async function(){
  const user=this;

  const token=await jwt.sign({_id:user._id},'mysecreaterefreshtoken',{
    expiresIn: "7d"
  })
  return token
} 

userSchema.methods.comparePassword=async function(enteredPassword){
  // const user=this;
  const hash=this.password;

  const isPasswordValid=await bcrypt.compare(enteredPassword,hash);
  return isPasswordValid;
}

module.exports=mongoose.model("User", userSchema);