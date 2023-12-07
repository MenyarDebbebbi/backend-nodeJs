const query = require("../services/db.js");


const getCategories = async (req, res) => {
    const sql = 'SELECT * FROM category';

    try {
        const rows = await query(sql);

        res.json({ data: rows });
      } catch (error) {
        console.log(error);
      }
};

const getCourses = async (req, res) => {
  const sql = `SELECT * FROM course`;

  try {
      const rows = await query(sql);
  
      res.json({ data: rows });
    } catch (error) {
      console.log(error);
    }
};

const getMyCourses = async (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM course  WHERE p_id = ?`;

  try {
      const rows = await query(sql,[id]);
  
      res.json({ data: rows });
    } catch (error) {
      console.log(error);
    }
};

const getCourse = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const sql = 'SELECT * FROM course WHERE c_id = ?';

  try {
      const rows = await query(sql,[id]);
  
      res.json({ data: rows });
    } catch (error) {
      console.log(error);
    }
};

const deleteCourse = async (req,res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM course WHERE c_id = ?'
  try {
    await query(sql,[id]);

    res.status(200).json({message: `Deleted ${id}`});
  } catch (error) {
      res.status(500).json({message: error});
  }
};

const addCourse = async (req,res) => {
  const { name, description, price, categoryId, professorId } = req.body;
  const sql = 'INSERT INTO course (name, description, price, p_id, cat_id ,created_at) VALUES (?, ?, ?, ?, ?, ?)';

  try {
      await query(sql, [name, description, price, professorId, categoryId, new Date()])

      res.status(201).json({message: `Course ${name} has been created`});
  } catch (error) {
      res.status(500).json({error});
  }
}

module.exports = {
  getCategories,
  getMyCourses,
  deleteCourse,
  addCourse,
  getCourses,
  getCourse
};