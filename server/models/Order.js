const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  currency: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseImage: String,
  courseTitle: String,
  courseId: String,
  coursePricing: String,
  cardLast4: String,
  invoiceNumber: String,
  billingDetails: {
    name: String,
    email: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
