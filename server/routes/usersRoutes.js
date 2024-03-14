const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModel");
const { default: mongoose } = require("mongoose");

//register user
router.post("/register", async (req, res) => {
  try {
    const userexists = await User.findOne({ email: req.body.email });
    if (userexists) {
      return res.send({
        success: false,
        message: "user already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "User registered succesfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    return res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique donars
router.get("/get-all-donars", authMiddleware, async (req, res) => {
  try {
    // get all unique donor ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorIds = await Inventory.distinct("donar", {
      organization,
    });

    const donars = await User.find({
      _id: { $in: uniqueDonorIds },
    });

    return res.send({
      success: true,
      message: "Donars fetched successfully",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get all unique hospitals
router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
  try {
    // get all unique hospital ids from inventory
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });

    const hospital = await User.find({
      _id: { $in: uniqueHospitalIds },
    });

    return res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospital,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Hospitals fetched successfully",
    });
  }
});

//get all unique organization for a donar
router.get(
  "/get-all-organizations-of-a-donar",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique hospital ids from inventory
      const donar = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        donar,
      });

      const hospital = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched successfully",
        data: hospital,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: "Hospitals fetched successfully",
      });
    }
  }
);

//get all unique organization for a hospital
router.get(
  "/get-all-organizations-of-a-hospital",
  authMiddleware,
  async (req, res) => {
    try {
      // get all unique organization ids from inventory
      const hospital = new mongoose.Types.ObjectId(req.body.userId);
      const uniqueOrganizationIds = await Inventory.distinct("organization", {
        hospital,
      });

      const hospitals = await User.find({
        _id: { $in: uniqueOrganizationIds },
      });

      return res.send({
        success: true,
        message: "Hospitals fetched successfully",
        data: hospitals,
      });
    } catch (error) {
      return res.send({
        success: false,
        message: "Hospitals fetched successfully",
      });
    }
  }
);

module.exports = router;
