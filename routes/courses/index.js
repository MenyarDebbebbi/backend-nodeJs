const express = require("express");

const courseController = require("../../controllers/courses.js");

const router = express.Router();

router.get('/', courseController.getCourses);
router.post('/delete/:id', courseController.deleteCourse);
router.get('/owner/:id', courseController.getMyCourses);
router.get('/:id', courseController.getCourse);
router.get('/categories/all', courseController.getCategories);
router.post('/add/new', courseController.addCourse);

module.exports = router;