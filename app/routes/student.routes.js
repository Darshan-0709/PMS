const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const {authenticate, authorizeStudentActions} = require('../middlewares/auth.middleware');
const {validateStudent, studentSchema} = require('../validations/student.validation');

router.get('/', 
  authenticate,
  studentController.getAllStudents
);

router.get('/:id', 
  authenticate,
  authorizeStudentActions,
  studentController.getStudentById
);

router.patch('/:id/update', 
  authenticate,
  authorizeStudentActions,
  validateStudent,
  studentController.updateStudent
);

router.delete('/:id/delete', 
  authenticate,
  authorizeStudentActions,
  studentController.deleteStudent
);

router.patch("/:id/restore", 
  authenticate,
  authorizeStudentActions,
  studentController.restoreStudent
);

module.exports = router;