const User = require("../../models/User");
const Course = require("../../models/Course");
const Order = require("../../models/Order");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ userName: 1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowedRoles = ["user", "instructor", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (req.user?._id === id && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCoursePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublised } = req.body;

    if (typeof isPublised !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPublised must be a boolean",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { isPublised },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course status updated",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getAllCourses,
  updateCoursePublishStatus,
  getAllOrders,
};
