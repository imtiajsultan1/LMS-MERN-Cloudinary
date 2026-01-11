const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  getInvoiceByOrderId,
} = require("../../controllers/student-controller/order-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);
router.get("/invoice/:orderId", authenticate, getInvoiceByOrderId);

module.exports = router;
