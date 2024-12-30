const User = require("../models/users");
const Group = require("../models/groups");
const { groupValidationSchema } = require("../validations/groupValidation");
const { getErrorCode } = require("../utils/getErrorCode");

const group = async (req, res) => {
  // console.log(req.user);
  // console.log(req.body);return;
  const { error, value } = groupValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorDetails = error.details.map((err) => {
      return {
        code: getErrorCode(err), // Map the error to a custom code
        message: err.message, // Use Joi's message for user-friendly text
      };
    });
    // Send the structured error response
    return res.status(400).json({
      success: false,
      errors: errorDetails,
    });
  }
  try {
      const groupOwnerId=req.user._id;
      const newGroup = new Group({
      group_name: value.groupname,
      group_detail: value.groupdetail,
      members: [
        {
          userId: groupOwnerId,
          balance: 0,
        }
      ],
    });
    const email = value.member_email;
    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: [
            {
              code: "ERR_EMAIL_TAKEN",
              message: "Email not found.",
            },
          ],
        });
      }
      const memberExist=newGroup.members.some((member)=>{
       return member.userId.toString() === user._id.toString();
      })
      if(!memberExist){
        newGroup.members.push({
          userId: user._id,
          balance: 0,
        })
      }
    }
    const response = await newGroup.save();
    res.status(201).json({
      status: "success",
      message: "New Group Created.",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          code: "ERR_SERVER",
          message: error.message,
        },
      ],
    });
  }
};

const addMembers = async (req, res) => {
  const { error, value } = groupValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorDetails = error.details.map((err) => {
      return {
        code: getErrorCode(err), // Map the error to a custom code
        message: err.message, // Use Joi's message for user-friendly text
      };
    });
    // Send the structured error response
    return res.status(400).json({
      success: false,
      errors: errorDetails,
    });
  }
  try {
    const groupId = req.params.id;
    const email = value.member_email;

    const group=await Group.findById(groupId);
    if(!group){
      return res.status(404).json({
        success: false,
        errors: [
          {
            code: "ERR_GROUP_NOT_FOUND",
            message: "Group not found.",
          },
        ],
      });
    }
    if(value.groupname){
      group.group_name=value.groupname
    }
    if(value.groupdetail){
      group.group_detail=value.groupdetail;
    }
    const ownerIndex= group.members.findIndex((member)=>member.userId.toString() === req.user._id.toString());
    if(ownerIndex=== -1){
      group.members.push({
        userId:req.user._id,
        balance:0,
      })
    }

    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: [
            {
              code: "ERR_EMAIL_NOT_FOUND",
              message: "Email not found.",
            },
          ],
        });
      }
      const isAlreadyMember = group.members.some(
        (member) => member.userId.toString() === user._id.toString()
      );
      if (isAlreadyMember) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              code: "ERR_USER_ALREADY_MEMBER",
              message: "User is already a member of this group.",
            },
          ],
        });
      }
      group.members.push({
        userId: user._id,
        balance: 0,
      });
    }

    const groupUpdate = await group.save();
    if (groupUpdate) {
      res.status(201).json({
        status: "success",
        message: "Group Updated.",
        data: groupUpdate,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          code: "ERR_SERVER",
          message: error.message,
        },
      ],
    });
  }
};

const getGroupDetails = async (req, res) => {
  try {
    const id = req.user._id;
    const groupDetails = await Group.find({
      "members.userId": id,
      status: "active",
    })
      .populate("members.userId", "username email")
      .exec();
    if (!groupDetails || groupDetails.length === 0) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            code: "ERR_GROUP_EMPTY",
            message: "No groups available.",
          },
        ],
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Groups retrieved successfully.",
      data: groupDetails,
    });
  } catch (error) {
    console.log(error);
  }
};

const closedGroup=async(req,res)=>{
  try {
    console.log(req.params.id)
    const groupId = req.params.id;
    const group=await Group.findById(groupId);
    if(!group){
      return res.status(404).json({
        success: false,
        errors: [
          {
            code: "ERR_GROUP_NOT_FOUND",
            message: "Group not found.",
          },
        ],
      });
    }
    const settlementStatus="completed";
    if(settlementStatus === 'completed'){
      const closedGroup=await Group.findByIdAndUpdate(groupId,{status:"closed"},{
        new:true,
      })
      return res.status(200).json({
        status: "success",
        message: "Groups successfully Closed.",
        data: closedGroup,
      });
    }
    
  } catch (error) {
    console.log(error)
  }

}
module.exports = { group, getGroupDetails, addMembers,closedGroup };
