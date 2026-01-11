const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const useDummyPayments =
  process.env.DUMMY_PAYMENTS === "true" ||
  !process.env.PAYPAL_CLIENT_ID ||
  !process.env.PAYPAL_SECRET_ID;

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${random}`;
};

const syncPurchaseData = async (order) => {
  const studentCourses = await StudentCourses.findOne({
    userId: order.userId,
  });

  if (studentCourses) {
    studentCourses.courses.push({
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    });

    await studentCourses.save();
  } else {
    const newStudentCourses = new StudentCourses({
      userId: order.userId,
      courses: [
        {
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        },
      ],
    });

    await newStudentCourses.save();
  }

  await Course.findByIdAndUpdate(order.courseId, {
    $addToSet: {
      students: {
        studentId: order.userId,
        studentName: order.userName,
        studentEmail: order.userEmail,
        paidAmount: order.coursePricing,
      },
    },
  });
};

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
      billingDetails,
      cardLast4,
    } = req.body;

    const isCardPayment = paymentMethod === "card";

    if (useDummyPayments || isCardPayment) {
      const newlyCreatedCourseOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus: "confirmed",
        paymentMethod: isCardPayment ? "card" : "dummy",
        paymentStatus: "paid",
        currency: "BDT",
        orderDate: orderDate || new Date(),
        paymentId: `DUMMY-${Date.now()}`,
        payerId: `DUMMY-${userId}`,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
        billingDetails,
        cardLast4,
        invoiceNumber: generateInvoiceNumber(),
      });

      await newlyCreatedCourseOrder.save();
      await syncPurchaseData(newlyCreatedCourseOrder);

      return res.status(201).json({
        success: true,
        message: "Dummy payment completed",
        data: {
          orderId: newlyCreatedCourseOrder._id,
          status: "completed",
        },
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment!",
        });
      } else {
        const newlyCreatedCourseOrder = new Order({
          userId,
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          currency: "BDT",
          orderDate,
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing,
          billingDetails,
          cardLast4,
          invoiceNumber: generateInvoiceNumber(),
        });

        await newlyCreatedCourseOrder.save();

        const approveUrl = paymentInfo.links.find(
          (link) => link.rel == "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          data: {
            approveUrl,
            orderId: newlyCreatedCourseOrder._id,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    await syncPurchaseData(order);

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getInvoiceByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user?.role !== "admin" &&
      req.user?._id !== order.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this invoice",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePaymentAndFinalizeOrder,
  getInvoiceByOrderId,
};
