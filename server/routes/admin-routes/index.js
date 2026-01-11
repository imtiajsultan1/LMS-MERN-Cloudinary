const express = require("express");
const authenticate = require("../../middleware/auth-middleware");
const requireRole = require("../../middleware/role-middleware");
const {
  getAllUsers,
  updateUserRole,
  getAllCourses,
  updateCoursePublishStatus,
  getAllOrders,
} = require("../../controllers/admin-controller/index");

const router = express.Router();

router.use(authenticate, requireRole("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/courses", getAllCourses);
router.patch("/courses/:id/publish", updateCoursePublishStatus);
router.get("/orders", getAllOrders);

module.exports = router;
