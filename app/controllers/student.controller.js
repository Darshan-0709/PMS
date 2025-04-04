const studentService = require("../services/student.service");

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedStudent = await studentService.updateStudent(id, updateData);
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete student (soft delete)
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);
    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredStudent = await studentService.restoreStudent(id);
    res.status(200).json({ success: true, data: restoredStudent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
