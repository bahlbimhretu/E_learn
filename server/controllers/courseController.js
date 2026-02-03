import CourseInstance from "../models/CourseInstance.js";
import CourseTemplate from "../models/CourseTemplate.js";
// Get all course instances assigned to the logged-in teacher
export const getMyCourseInstances = async (req, res) => {
  try {
    const instances = await CourseInstance.find({ teacher: req.user._id })
      .populate("courseTemplate", "name category description thumbnail")
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    res.json(instances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single course instance assigned to the logged-in teacher
export const getMyCourseInstance = async (req, res) => {
  try {
    const instance = await CourseInstance.findById(req.params.id)
      .populate("courseTemplate", "name category description thumbnail")
      .populate("students", "name email");

    if (!instance) return res.status(404).json({ message: "Course instance not found" });

    // Ensure only the assigned teacher can view
    if (!instance.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this course instance" });
    }

    res.json(instance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Course Template (admin)
//
export const createCourseTemplate = async (req, res) => {
  try {
    const { name, code, grade } = req.body;

    if (!name || !code || !grade) {
      return res
        .status(400)
        .json({ message: "Name, code, and grade are required" });
    }

    const exists = await CourseTemplate.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const thumbnail = req.file
      ? `/uploads/course-thumbnails/${req.file.filename}`
      : undefined;

    const course = await CourseTemplate.create({
      ...req.body,
      thumbnail,
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("CREATE COURSE TEMPLATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// Get Course Templates 

export const getCourseTemplates = async (req, res) => {
  const { grade, status } = req.query;

  const filter = {};
  if (grade) filter.grade = grade;
  if (status) filter.status = status;

  const courses = await CourseTemplate.find(filter)
    .sort({ grade: 1, name: 1 });

  res.json(courses);
};
// Get Course Template by ID
export const getCourseTemplateById = async (req, res) => {
  const course = await CourseTemplate.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
};
// Update Course Template
export const updateCourseTemplate = async (req, res) => {
  try {
    const course = await CourseTemplate.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.name = req.body.name ?? course.name;
    course.description = req.body.description ?? course.description;
    course.creditHours = req.body.creditHours ?? course.creditHours;
    course.category = req.body.category ?? course.category;
    course.isElective = req.body.isElective ?? course.isElective;

    if (req.file) {
      course.thumbnail = `/uploads/course-thumbnails/${req.file.filename}`;
    }

    await course.save();
    res.json(course);
  } catch (err) {
    console.error("UPDATE COURSE TEMPLATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//archive Course Template
export const archiveCourseTemplate = async (req, res) => {
  const course = await CourseTemplate.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.status = "archived";
  await course.save();

  res.json({ message: "Course archived" });
};
//restore Course Template
export const restoreCourseTemplate = async (req, res) => {
  try {
    const course = await CourseTemplate.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course template not found" });
    }

    course.status = "active";
    await course.save();

    res.json(course);
  } catch (error) {
    console.error("RESTORE COURSE TEMPLATE ERROR", error);
    res.status(500).json({ message: "Failed to restore course template" });
  }
};

