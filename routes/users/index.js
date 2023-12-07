const express = require("express");

const userController = require("../../controllers/users.js");

const router = express.Router();

router.get('/current/:id', userController.getCurrentUser);
router.patch('/current/:id', userController.patchCurrentUser);
router.get('/students', userController.getStudents);
router.get('/professors', userController.getProfessors);
router.post('/delete', userController.deleteUser);

module.exports = router;