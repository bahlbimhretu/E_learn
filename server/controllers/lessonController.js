import Lesson from "../models/Lesson.js";

// CREATE LESSON
export const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, videoUrl, order } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!courseId || !title || order == null)
      return res.status(400).json({ message: "Missing required fields" });

    const lesson = await Lesson.create({
      course: courseId,
      title,
      content,
      videoUrl,
      order: Number(order),
      createdBy: req.user._id,
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// GET LESSONS FOR A COURSE
export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 })
      .populate("createdBy", "name role");

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE LESSON
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LESSON
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Only admin or creator
    if (
      req.user.role !== "admin" &&
      lesson.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to edit lesson" });
    }

    lesson.title = req.body.title || lesson.title;
    lesson.content = req.body.content || lesson.content;
    lesson.videoUrl = req.body.videoUrl || lesson.videoUrl;
    lesson.order = req.body.order || lesson.order;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LESSON
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Permission check
    if (
      req.user.role !== "admin" &&
      lesson.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to delete lesson" });
    }

    await lesson.deleteOne();
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
