import Material from "../models/Material.js";

// UPLOAD MATERIAL (Teacher/Admin)
export const uploadMaterial = async (req, res) => {
  try {
    const { title, courseId, lessonId } = req.body;

    if (!title || !courseId || !lessonId) {
      return res.status(400).json({
        message: "Title, Course ID, and Lesson ID are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    // 🔹 Normalize file type for frontend
    let fileType = "file";
    if (req.file.mimetype.includes("pdf")) fileType = "pdf";
    else if (req.file.mimetype.startsWith("image/")) fileType = "image";
    else if (req.file.mimetype.startsWith("video/")) fileType = "video";

    const material = await Material.create({
      course: courseId,
      lesson: lessonId,
      title,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType,
      uploadedBy: req.user._id,
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// GET MATERIALS FOR A LESSON (Student/Teacher/Admin)
export const getMaterialsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const materials = await Material.find({ lesson: lessonId })
      .select("title fileUrl fileType createdAt")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE MATERIAL
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Admin can delete anything
    // Teacher can delete only their own
    if (
      req.user.role !== "admin" &&
      material.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await material.deleteOne();
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
