const {
  userValidationSchema,
  signInValidationSchema,
} = require("../validations/uservalidation");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userSignUp = async (req, res) => {
  // console.log(req.body);
  /**Need to work on standard error formate */
  const { error, value } = userValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message.replace(/"/g, "")),
    });
  }
  try {
    const existingEmail = await User.findOne({ email: value.email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, errors: ["Email is already taken."] });
    }
    const existingContactNumber = await User.findOne({ phone: value.phone });
    if (existingContactNumber) {
      return res
        .status(400)
        .json({
          success: false,
          errors: ["Phone number is already registered"],
        });
    }

    const data = await User.create(value);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
      },
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const userSignIn = async (req, res) => {
  const { error, value } = signInValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message.replace(/"/g, "")),
    });
  }
  try {
    const user = await User.findOne({ email: value.email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, errors: ["Invalid credentials!"] });
    }
    const isPasswordValid = await user.comparePassword(req.body.password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      const refreshToken = await user.getJWTRefreshToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({
        status: "success",
        message: "User registered successfully",
        data: {
          username: user.username,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, errors: ["Invalid credentials!"] });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const { username, email, gender, phone } = req.user;
    res.status(200).json({
      status: "success",
      data: {
        username: username,
        email: email,
        phone: phone,
        gender: gender,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not found" });
  }
  try {
    const decodeObj = await jwt.verify(refreshToken, "mysecreaterefreshtoken");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User Not Found!" });
    }
    const token = await user.getJWT();
    res
      .status(200)
      .cookie("token", token, {
        expiresIn: "8h",
      })
      .json({ message: "Access token refreshed" });
  } catch (error) {
    res
      .status(403)
      .json({ error: error.message, message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
};

module.exports = {
  userSignUp,
  userSignIn,
  getUser,
  refreshAccessToken,
  logout,
};
