import CourseInstance from "../models/CourseInstance.js";

export const getMyCourseInstances = async (req, res) => {
  const instances = await CourseInstance.find({
    teacher: req.user._id,
    status: "active",
  })
    .populate({
      path: "courseTemplate",
      select: "title description",
    })
    .select(
      "academicYear grade section students courseTemplate createdAt"
    )
    .sort({ grade: 1, section: 1 });

  res.json(instances);
};
export const getMyCourseInstanceById = async (req, res) => {
  const instance = await CourseInstance.findOne({
    _id: req.params.id,
    teacher: req.user._id,
  })
    .populate({
      path: "courseTemplate",
      select: "title description",
    })
    .populate({
      path: "students",
      select: "name email",
    });

  if (!instance) {
    return res.status(404).json({
      message: "Course instance not assigned to you",
    });
  }

  res.json(instance);
};
export const teacherOwnsInstance = async (req, res, next) => {
  const instance = await CourseInstance.findOne({
    _id: req.params.instanceId,
    teacher: req.user._id,
  });

  if (!instance) {
    return res.status(403).json({
      message: "You are not assigned to this course",
    });
  }

  req.courseInstance = instance;
  next();
};
