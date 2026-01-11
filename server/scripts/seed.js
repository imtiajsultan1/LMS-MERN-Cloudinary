const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const StudentCourses = require("../models/StudentCourses");
const Order = require("../models/Order");
const CourseProgress = require("../models/CourseProgress");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DEFAULT_PASSWORD = "Password123!";
const SHOULD_RESET = process.argv.includes("--reset");

const videoUrls = [
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-60s.mp4",
];

const languageLabels = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
  "Arabic",
  "Russian",
];

function buildCurriculum(lessonTitles, startIndex = 0) {
  return lessonTitles.map((title, index) => ({
    title,
    videoUrl: videoUrls[(startIndex + index) % videoUrls.length],
    public_id: "",
    freePreview: index === 0,
  }));
}

function buildCourseTemplates() {
  return [
    {
      title: "Modern Web Development Bootcamp",
      category: "web-development",
      level: "beginner",
      subtitle: "From HTML to React with real projects",
      description:
        "A fast, practical intro to building modern web apps using HTML, CSS, JavaScript, and React.",
      image: "https://picsum.photos/seed/lms-course-1/800/450",
      welcomeMessage: "Welcome to the web dev bootcamp!",
      pricing: 49,
      objectives:
        "Build responsive layouts,Understand React fundamentals,Deploy web apps,Ship a portfolio project",
      curriculum: buildCurriculum(
        [
          "Course Overview",
          "HTML Foundations",
          "Modern CSS Layouts",
          "Responsive Design",
          "JavaScript Essentials",
          "DOM and Events",
          "React Basics",
          "State and Props",
          "Deploying Your App",
        ],
        0
      ),
      isPublised: true,
    },
    {
      title: "Advanced React Studio",
      category: "web-development",
      level: "advanced",
      subtitle: "Hooks, performance, and real-world patterns",
      description:
        "Deep dive into React hooks, performance profiling, and scalable UI architecture.",
      image: "https://picsum.photos/seed/lms-course-11/800/450",
      welcomeMessage: "Level up your React skills.",
      pricing: 99,
      objectives:
        "Master hooks,Optimize rendering,Build reusable components,Structure large apps",
      curriculum: buildCurriculum(
        [
          "React Refresh",
          "Custom Hooks",
          "State Management Patterns",
          "Performance Profiling",
          "Memoization and Caching",
          "Component Architecture",
          "Testing React Apps",
          "Deployment Checklist",
        ],
        1
      ),
      isPublised: true,
    },
    {
      title: "Node.js API Masterclass",
      category: "backend-development",
      level: "intermediate",
      subtitle: "Build secure, scalable REST APIs",
      description:
        "Learn Node.js, Express, and MongoDB to build production-grade APIs.",
      image: "https://picsum.photos/seed/lms-course-2/800/450",
      welcomeMessage: "Let's build a backend you can trust.",
      pricing: 69,
      objectives:
        "Design REST APIs,Handle auth securely,Work with MongoDB,Ship production APIs",
      curriculum: buildCurriculum(
        [
          "API Design Principles",
          "Express Routing",
          "Authentication and JWT",
          "MongoDB Data Modeling",
          "Validation and Errors",
          "Rate Limiting",
          "Testing APIs",
          "Deploying APIs",
        ],
        1
      ),
      isPublised: true,
    },
    {
      title: "Python FastAPI for APIs",
      category: "backend-development",
      level: "intermediate",
      subtitle: "Modern Python APIs with FastAPI",
      description:
        "Build fast, type-safe APIs with FastAPI and Pydantic.",
      image: "https://picsum.photos/seed/lms-course-12/800/450",
      welcomeMessage: "Build Python APIs quickly.",
      pricing: 65,
      objectives:
        "Design FastAPI projects,Use Pydantic models,Secure endpoints,Deploy APIs",
      curriculum: buildCurriculum(
        [
          "FastAPI Overview",
          "Routing and Schemas",
          "Dependency Injection",
          "Authentication Basics",
          "Async DB Access",
          "Testing FastAPI",
          "Background Tasks",
          "Deploying FastAPI",
        ],
        2
      ),
      isPublised: true,
    },
    {
      title: "Data Science Fundamentals",
      category: "data-science",
      level: "beginner",
      subtitle: "Analyze and visualize real-world data",
      description:
        "Get started with data analysis, visualization, and basic statistics.",
      image: "https://picsum.photos/seed/lms-course-3/800/450",
      welcomeMessage: "Welcome to your data journey.",
      pricing: 59,
      objectives:
        "Clean data with Python,Build charts and dashboards,Understand key stats,Share insights",
      curriculum: buildCurriculum(
        [
          "Data Science Workflow",
          "Cleaning Data",
          "Exploratory Analysis",
          "Visualization Basics",
          "Summary Statistics",
          "Hypothesis Basics",
          "Building Dashboards",
          "Presenting Insights",
        ],
        2
      ),
      isPublised: true,
    },
    {
      title: "Data Visualization with Python",
      category: "data-science",
      level: "intermediate",
      subtitle: "Tell stories with charts and dashboards",
      description:
        "Create effective visuals using Matplotlib, Seaborn, and Plotly.",
      image: "https://picsum.photos/seed/lms-course-13/800/450",
      welcomeMessage: "Make data easy to understand.",
      pricing: 55,
      objectives:
        "Choose the right chart,Build interactive visuals,Design dashboards,Communicate insights",
      curriculum: buildCurriculum(
        [
          "Visualization Principles",
          "Matplotlib Essentials",
          "Seaborn for Insights",
          "Plotly Interactivity",
          "Color and Accessibility",
          "Dashboard Layouts",
          "Storytelling with Data",
          "Publishing Reports",
        ],
        3
      ),
      isPublised: true,
    },
    {
      title: "Machine Learning in Practice",
      category: "machine-learning",
      level: "intermediate",
      subtitle: "Train and evaluate real ML models",
      description:
        "Build and evaluate regression and classification models step by step.",
      image: "https://picsum.photos/seed/lms-course-4/800/450",
      welcomeMessage: "Let's train your first model.",
      pricing: 89,
      objectives:
        "Prepare datasets,Train ML models,Evaluate performance,Deploy models",
      curriculum: buildCurriculum(
        [
          "ML Foundations",
          "Feature Engineering",
          "Regression Models",
          "Classification Models",
          "Model Evaluation",
          "Cross Validation",
          "Model Deployment",
          "Monitoring Models",
        ],
        3
      ),
      isPublised: true,
    },
    {
      title: "Applied Machine Learning Projects",
      category: "machine-learning",
      level: "advanced",
      subtitle: "Build real ML applications",
      description:
        "Hands-on projects across NLP, vision, and recommendation systems.",
      image: "https://picsum.photos/seed/lms-course-14/800/450",
      welcomeMessage: "Ship real ML projects.",
      pricing: 109,
      objectives:
        "Frame ML problems,Build pipelines,Optimize models,Deliver ML apps",
      curriculum: buildCurriculum(
        [
          "Project Setup",
          "Text Classification",
          "Recommendation Systems",
          "Computer Vision Basics",
          "Model Serving",
          "Performance Tuning",
          "Experiment Tracking",
          "Final Project",
        ],
        4
      ),
      isPublised: true,
    },
    {
      title: "AI for Product Builders",
      category: "artificial-intelligence",
      level: "advanced",
      subtitle: "Ship AI features in real apps",
      description:
        "Learn practical AI patterns and how to integrate them into products.",
      image: "https://picsum.photos/seed/lms-course-5/800/450",
      welcomeMessage: "Build smarter products with AI.",
      pricing: 119,
      objectives:
        "Pick the right models,Integrate AI safely,Ship AI features,Measure impact",
      curriculum: buildCurriculum(
        [
          "AI Product Strategy",
          "Model Selection",
          "Prompt Engineering",
          "Evaluation and Monitoring",
          "Responsible AI",
          "AI UX Patterns",
          "Cost Optimization",
          "Launch Checklist",
        ],
        0
      ),
      isPublised: true,
    },
    {
      title: "Prompt Engineering Workshop",
      category: "artificial-intelligence",
      level: "intermediate",
      subtitle: "Design prompts that work",
      description: "Learn prompt patterns, tools, and evaluation techniques.",
      image: "https://picsum.photos/seed/lms-course-15/800/450",
      welcomeMessage: "Write better prompts.",
      pricing: 45,
      objectives:
        "Craft effective prompts,Use system roles,Test outputs,Reduce hallucinations",
      curriculum: buildCurriculum(
        [
          "Prompt Basics",
          "Instruction Patterns",
          "Few-shot Examples",
          "Tool Use",
          "Output Evaluation",
          "Safety and Guardrails",
          "Prompt Debugging",
          "Prompt Library",
        ],
        1
      ),
      isPublised: true,
    },
    {
      title: "Cloud Computing Essentials",
      category: "cloud-computing",
      level: "beginner",
      subtitle: "Deploy apps confidently to the cloud",
      description:
        "Understand core cloud concepts and deploy a web app end-to-end.",
      image: "https://picsum.photos/seed/lms-course-6/800/450",
      welcomeMessage: "Cloud fundamentals start here.",
      pricing: 39,
      objectives:
        "Understand cloud basics,Deploy web apps,Monitor services,Manage costs",
      curriculum: buildCurriculum(
        [
          "Cloud Concepts",
          "Compute and Storage",
          "Networking Basics",
          "Deploying Applications",
          "Monitoring and Logs",
          "Identity Basics",
          "Cost Management",
          "Cloud Best Practices",
        ],
        1
      ),
      isPublised: true,
    },
    {
      title: "AWS DevOps Pipeline",
      category: "cloud-computing",
      level: "intermediate",
      subtitle: "CI/CD and infrastructure automation",
      description: "Build pipelines and automate deployments with AWS.",
      image: "https://picsum.photos/seed/lms-course-16/800/450",
      welcomeMessage: "Automate your releases.",
      pricing: 79,
      objectives:
        "Build CI/CD pipelines,Automate infrastructure,Monitor deployments,Handle rollbacks",
      curriculum: buildCurriculum(
        [
          "DevOps Overview",
          "CI with GitHub Actions",
          "Docker Basics",
          "Infrastructure as Code",
          "Deploying to AWS",
          "Monitoring and Alerts",
          "Blue-Green Deployments",
          "Rollback Strategies",
        ],
        2
      ),
      isPublised: true,
    },
    {
      title: "Cyber Security Basics",
      category: "cyber-security",
      level: "beginner",
      subtitle: "Protect systems and data",
      description:
        "Learn essential security practices for developers and teams.",
      image: "https://picsum.photos/seed/lms-course-7/800/450",
      welcomeMessage: "Security is a skill, not a tool.",
      pricing: 45,
      objectives:
        "Understand threats,Apply secure practices,Monitor vulnerabilities,Respond to incidents",
      curriculum: buildCurriculum(
        [
          "Security Mindset",
          "Common Vulnerabilities",
          "Safe Authentication",
          "Data Protection",
          "Network Basics",
          "Security Testing",
          "Incident Response",
          "Security Checklist",
        ],
        2
      ),
      isPublised: true,
    },
    {
      title: "Web Security Deep Dive",
      category: "cyber-security",
      level: "advanced",
      subtitle: "Defend modern web apps",
      description: "Harden apps against OWASP threats and modern attacks.",
      image: "https://picsum.photos/seed/lms-course-17/800/450",
      welcomeMessage: "Secure every layer.",
      pricing: 95,
      objectives:
        "Mitigate OWASP risks,Secure APIs,Protect user data,Audit security",
      curriculum: buildCurriculum(
        [
          "OWASP Top 10",
          "Threat Modeling",
          "Secure Sessions",
          "API Security",
          "Input Validation",
          "Content Security Policy",
          "Security Logging",
          "Pen Testing Basics",
        ],
        3
      ),
      isPublised: true,
    },
    {
      title: "Mobile App Development",
      category: "mobile-development",
      level: "intermediate",
      subtitle: "Build cross-platform apps fast",
      description:
        "Create performant mobile apps with modern frameworks and tooling.",
      image: "https://picsum.photos/seed/lms-course-8/800/450",
      welcomeMessage: "Let's build your first mobile app.",
      pricing: 79,
      objectives:
        "Design mobile UI,Manage state,Ship cross-platform apps,Integrate APIs",
      curriculum: buildCurriculum(
        [
          "Mobile UX Basics",
          "Layout and Navigation",
          "State Management",
          "API Integration",
          "Local Storage",
          "Push Notifications",
          "Testing Mobile Apps",
          "App Deployment",
        ],
        3
      ),
      isPublised: true,
    },
    {
      title: "Flutter Mobile Lab",
      category: "mobile-development",
      level: "beginner",
      subtitle: "Create beautiful Flutter apps",
      description: "Build fast Flutter UIs and ship to Android and iOS.",
      image: "https://picsum.photos/seed/lms-course-18/800/450",
      welcomeMessage: "Flutter from scratch.",
      pricing: 69,
      objectives:
        "Build Flutter UI,Use widgets effectively,Manage state,Release apps",
      curriculum: buildCurriculum(
        [
          "Flutter Setup",
          "Widgets 101",
          "Layouts and Styles",
          "State Management",
          "Networking",
          "Local Storage",
          "Animations",
          "Release Checklist",
        ],
        4
      ),
      isPublised: true,
    },
    {
      title: "Game Development Foundations",
      category: "game-development",
      level: "beginner",
      subtitle: "Create your first 2D game",
      description:
        "Learn game loops, physics, and animations with a hands-on project.",
      image: "https://picsum.photos/seed/lms-course-9/800/450",
      welcomeMessage: "Let's build a game together.",
      pricing: 55,
      objectives:
        "Create a game loop,Animate characters,Handle game physics,Publish a demo",
      curriculum: buildCurriculum(
        [
          "Game Design Basics",
          "Sprite Animation",
          "Physics and Collisions",
          "Input Handling",
          "Scoring and UI",
          "Level Design",
          "Audio Effects",
          "Publishing",
        ],
        0
      ),
      isPublised: true,
    },
    {
      title: "Unity 2D Game Builder",
      category: "game-development",
      level: "intermediate",
      subtitle: "Build and ship a Unity 2D game",
      description: "Create a polished 2D game with Unity and C#.",
      image: "https://picsum.photos/seed/lms-course-19/800/450",
      welcomeMessage: "Make your first Unity game.",
      pricing: 89,
      objectives:
        "Use Unity editor,Script gameplay,Create levels,Ship builds",
      curriculum: buildCurriculum(
        [
          "Unity Basics",
          "Scenes and Prefabs",
          "Player Movement",
          "Physics and Collisions",
          "Enemy AI",
          "UI and Menus",
          "Builds and Optimization",
          "Game Jam Project",
        ],
        1
      ),
      isPublised: true,
    },
    {
      title: "Software Engineering Practices",
      category: "software-engineering",
      level: "advanced",
      subtitle: "Ship reliable software at scale",
      description:
        "Learn architecture, testing, and delivery practices for teams.",
      image: "https://picsum.photos/seed/lms-course-10/800/450",
      welcomeMessage: "Build software that lasts.",
      pricing: 99,
      objectives:
        "Design clean architectures,Write solid tests,Ship continuously,Lead teams",
      curriculum: buildCurriculum(
        [
          "Design Principles",
          "Testing Strategies",
          "CI/CD Pipelines",
          "Observability",
          "Code Reviews",
          "Documentation",
          "Release Management",
          "Team Practices",
        ],
        1
      ),
      isPublised: true,
    },
  ];
}

function buildUsers(hash) {
  const admins = [
    {
      userName: "Admin User",
      userEmail: "admin@example.com",
      role: "admin",
      password: hash,
    },
    {
      userName: "Super Admin",
      userEmail: "superadmin@example.com",
      role: "admin",
      password: hash,
    },
  ];

  const instructors = [
    {
      userName: "Ava Stone",
      userEmail: "ava.instructor@example.com",
      role: "instructor",
      password: hash,
    },
    {
      userName: "Noah Brooks",
      userEmail: "noah.instructor@example.com",
      role: "instructor",
      password: hash,
    },
  ];

  const students = [
    {
      userName: "Mia Patel",
      userEmail: "mia.student@example.com",
      role: "user",
      password: hash,
    },
    {
      userName: "Ethan Kim",
      userEmail: "ethan.student@example.com",
      role: "user",
      password: hash,
    },
    {
      userName: "Sofia Santos",
      userEmail: "sofia.student@example.com",
      role: "user",
      password: hash,
    },
    {
      userName: "Lucas Martin",
      userEmail: "lucas.student@example.com",
      role: "user",
      password: hash,
    },
    {
      userName: "Zara Ali",
      userEmail: "zara.student@example.com",
      role: "user",
      password: hash,
    },
    {
      userName: "Oliver Chen",
      userEmail: "oliver.student@example.com",
      role: "user",
      password: hash,
    },
  ];

  return { admins, instructors, students };
}

function buildPurchaseMatrix(courseCount, studentCount) {
  const matrix = [];
  const minCourses = 4;
  const maxCourses = 6;

  for (let studentIndex = 0; studentIndex < studentCount; studentIndex += 1) {
    const count = minCourses + (studentIndex % (maxCourses - minCourses + 1));
    const picks = new Set();
    const start = studentIndex * 2;

    for (let step = 0; step < count; step += 1) {
      picks.add((start + step * 3) % courseCount);
    }

    matrix.push([...picks]);
  }

  return matrix;
}

function buildProgressSpecs() {
  return [
    { studentIndex: 0, courseIndex: 0, viewedCount: 2 },
    { studentIndex: 1, courseIndex: 1, completed: true },
    { studentIndex: 2, courseIndex: 4, viewedCount: 3 },
    { studentIndex: 3, courseIndex: 2, completed: true },
    { studentIndex: 4, courseIndex: 6, viewedCount: 4 },
    { studentIndex: 5, courseIndex: 8, viewedCount: 1 },
  ];
}

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in server/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const indexes = await User.collection.indexes();
    if (indexes.some((index) => index.name === "email_1")) {
      await User.collection.dropIndex("email_1");
      console.log("Dropped legacy users.email_1 index.");
    }
  } catch (error) {
    console.log("Skipping index cleanup:", error?.message || error);
  }

  const existingCounts = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    StudentCourses.countDocuments(),
    Order.countDocuments(),
    CourseProgress.countDocuments(),
  ]);

  const hasExistingData = existingCounts.some((count) => count > 0);

  if (hasExistingData && !SHOULD_RESET) {
    console.log("Seed skipped: data already exists.");
    console.log("Run `npm run seed:reset` to wipe and reseed.");
    await mongoose.disconnect();
    return;
  }

  if (SHOULD_RESET) {
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      StudentCourses.deleteMany({}),
      Order.deleteMany({}),
      CourseProgress.deleteMany({}),
    ]);
  }

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const { admins, instructors, students } = buildUsers(hash);

  const userDocs = await User.insertMany([
    ...admins,
    ...instructors,
    ...students,
  ]);
  const adminDocs = userDocs.filter((user) => user.role === "admin");
  const instructorDocs = userDocs.filter((user) => user.role === "instructor");
  const studentDocs = userDocs.filter((user) => user.role === "user");

  const courseTemplates = buildCourseTemplates();
  const coursesToCreate = courseTemplates.map((course, index) => {
    const instructor = instructorDocs[index % instructorDocs.length];
    return {
      ...course,
      instructorId: instructor._id.toString(),
      instructorName: instructor.userName,
      primaryLanguage: languageLabels[index % languageLabels.length],
      date: new Date(2024, index % 12, 1 + (index % 27)),
      students: [],
    };
  });

  const courseDocs = await Course.insertMany(coursesToCreate);

  const purchaseMatrix = buildPurchaseMatrix(
    courseDocs.length,
    studentDocs.length
  );
  const orders = [];
  const courseStudentsMap = new Map();
  const studentCoursesDocs = studentDocs.map((student, studentIndex) => {
    const purchaseIndexes = purchaseMatrix[studentIndex] || [];
    const purchasedCourses = purchaseIndexes.map((courseIndex, orderIndex) => {
      const course = courseDocs[courseIndex];
      const orderDate = new Date(2024, (courseIndex + 2) % 12, 5 + orderIndex);

      const studentEntry = {
        studentId: student._id.toString(),
        studentName: student.userName,
        studentEmail: student.userEmail,
        paidAmount: course.pricing.toFixed(2),
      };

      const existingStudents = courseStudentsMap.get(course._id.toString()) || [];
      courseStudentsMap.set(course._id.toString(), [...existingStudents, studentEntry]);

      orders.push({
        userId: student._id.toString(),
        userName: student.userName,
        userEmail: student.userEmail,
        orderStatus: "confirmed",
        paymentMethod: "paypal",
        paymentStatus: "paid",
        orderDate,
        paymentId: `PAYID-${studentIndex}${courseIndex}${orderIndex}`,
        payerId: `PAYER-${studentIndex}${courseIndex}${orderIndex}`,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        courseImage: course.image,
        courseTitle: course.title,
        courseId: course._id.toString(),
        coursePricing: course.pricing.toFixed(2),
      });

      return {
        courseId: course._id.toString(),
        title: course.title,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        dateOfPurchase: orderDate,
        courseImage: course.image,
      };
    });

    return {
      userId: student._id.toString(),
      courses: purchasedCourses,
    };
  });

  for (const course of courseDocs) {
    const enrolledStudents = courseStudentsMap.get(course._id.toString()) || [];
    course.students = enrolledStudents;
    await course.save();
  }

  await StudentCourses.insertMany(studentCoursesDocs);
  await Order.insertMany(orders);

  const progressSpecs = buildProgressSpecs();
  const progressDocs = progressSpecs.map((spec) => {
    const student = studentDocs[spec.studentIndex];
    const course = courseDocs[spec.courseIndex];
    const lectureCount = course.curriculum.length;
    const viewedCount = spec.completed ? lectureCount : spec.viewedCount || 0;

    return {
      userId: student._id.toString(),
      courseId: course._id.toString(),
      completed: Boolean(spec.completed),
      completionDate: spec.completed ? new Date() : null,
      lecturesProgress: course.curriculum.slice(0, viewedCount).map((lecture) => ({
        lectureId: lecture._id.toString(),
        viewed: true,
        dateViewed: new Date(),
      })),
    };
  });

  await CourseProgress.insertMany(progressDocs);

  console.log("Seed completed.");
  console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
  console.log(
    `Created ${adminDocs.length} admins, ${instructorDocs.length} instructors, ${studentDocs.length} students, ${courseDocs.length} courses.`
  );
  console.log(
    `Created ${studentCoursesDocs.length} student course lists, ${orders.length} orders, ${progressDocs.length} progress records.`
  );

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
