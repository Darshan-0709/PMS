const db = require("../models");
const Student = db.student;

exports.findStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: ["placementCell"],
    });
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findStudentByPlacementCell = async (req, res) => {
  try {
    const placementCell = await db.placementCell.findOne({
      where: {
        adminId: req.user.userId,
      },
    });
    if (!placementCell) {
      return res.status(401).send({ message: "Unauthorized access!" });
    }
    const students = await Student.findAll({
      where: { placementCellId: placementCell.placementCellId },
    });
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: ["placementCell"],
    });
    if (!isValidBranch(student, req.body.branch)) {
      return res.status(400).send({
        message: "branch does not exists for this your Placement Cell",
      });
    }
    const [updatedRows] = await Student.update(
      {
        branch: req.body.branch,
        enrollmentNo: req.body.enrollmentNo,
      },
      {
        where: { studentId: req.params.id },
      }
    );
    if (updatedRows === 0) {
      return res
        .status(404)
        .send({ message: "Student not found or no changes made" });
    }
    res.send({ message: "Student updated successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

function isValidBranch(student, branch) {
  const branches = student.placementCell.branches.split(",");
  return branches.includes(branch.toUpperCase().trim());
}
