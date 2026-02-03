import Material from "../models/Material.js";

// UPLOAD MATERIAL (Teacher/Admin)
export const uploadMaterial = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: "Title and Course ID are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const material = await Material.create({
      course: courseId,
      title,
      fileUrl: `/uploads/${req.file.filename}`, // Match your middleware
      fileType: req.file.mimetype,             // Example: application/pdf, video/mp4
      uploadedBy: req.user._id,
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MATERIALS FOR A COURSE
export const getMaterialsByCourse = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name role");

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

    // Teacher can delete ONLY their own materials
    if (
      req.user.role !== "admin" &&
      material.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this material" });
    }

    await material.deleteOne();
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
