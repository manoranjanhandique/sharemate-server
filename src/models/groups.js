const  mongoose  = require("mongoose");

const groupSchema=new mongoose.Schema({
    group_name:{
        type:String,
        require:true
    },
    group_details:{
        type:String,
        require:true
    },
    members:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true,
        },
        balance:{
            type:Number,
            default:0,
        }
    }]
},{
    timestamps:true,
})

module.exports=mongoose.model('Group', groupSchema);