const { Student } = require("../models");
const { NotFoundError } = require("../utils/errors");

// Get all students
exports.getAllStudents = async () => {
  // return await Student.findAll();
  return await Student.findAll({ paranoid: false });
};

// Get student by ID
exports.getStudentById = async (studentId) => {
  // const student = await Student.findByPk(studentId);
  const student = await Student.findByPk(studentId, { paranoid: false }); // ✅ Include soft-deleted students
  if (!student || student.deleted_at) {
    throw new NotFoundError("Student not found");
  }
  return student;
};

// Update student details
exports.updateStudent = async (studentId, updateData) => {
  const student = await Student.findByPk(studentId);
  if (!student || student.deleted_at) {
    throw new NotFoundError("Student not found");
  }

  await student.update(updateData);
  return student;
};

// Soft delete student
exports.deleteStudent = async (studentId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  await student.destroy();
  return { message: "Student deleted successfully" };
};

exports.restoreStudent = async (studentId) => {
  const student = await Student.findByPk(studentId, { paranoid: false });
  console.log("Student found:", student); // ✅ Debugging
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  if (!student.deletedAt) {
    throw new Error("Student is not deleted");
  }

  await student.restore(); // ✅ Restores the record (sets `deleted_at = NULL`)
  return student;
};
