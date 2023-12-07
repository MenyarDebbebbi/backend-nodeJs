const query = require("../services/db.js");

const getCurrentUser = async (req, res) => {
  const sql = `
  SELECT
  u.user_id,
  u.user_name,
  u.user_email,
  u.user_phone,
  u.user_image,
  u.user_type,
  u.user_bio,
  u.created_at,
  u.user_verified,
  s.st_id AS student_id,
  s.ville AS student_ville,
  s.profession AS student_profession,
  s.score AS student_score,
  s.score_gpa AS student_score_gpa,
  p.p_id AS professor_id,
  p.profession AS professor_profession,
  p.reference_id AS professor_reference_id,
  p.rating AS professor_rating
FROM
  user u
LEFT JOIN
  student s ON u.user_id = s.st_id AND u.user_type = 'student'
LEFT JOIN
  professor p ON u.user_id = p.p_id AND u.user_type = 'professor'
  LEFT JOIN
  admin a ON u.user_id = a.a_id AND u.user_type = 'admin'
WHERE
u.user_id = ? AND (u.user_type = 'student' OR u.user_type = 'professor' OR u.user_type = 'admin');
  `;

  try {
    const id = req.params.id;

    const rows = await query(sql, [id]);

    res.json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};

const patchCurrentUser = async (req, res) => {
    const id = req.params.id;
    const { user_name, user_email, user_phone } = req.body;

    try {
        const updateFields = [];
        const params = [];

        if(user_name) {
            updateFields.push('user_name = ?');
            params.push(user_name);
        }
        if(user_email) {
            updateFields.push('user_email = ?');
            params.push(user_email);
        }
        if(user_phone) {
            updateFields.push('user_phone = ?');
            params.push(user_phone);
        }
        
        params.push(id);

        await query(
            `UPDATE user SET ${updateFields.join(', ')} WHERE user_id = ?`,
            params
        )

        res.status(200).json({message: "User updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error "});
    }
};

const getStudents = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM user WHERE user_type = "student"');

    res.json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const rows = await query("DELETE FROM user WHERE user_id = ?", [id]);

    res.json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};

const getProfessors = async (req, res) => {
  try {
    const rows = await query(
      'SELECT * FROM user WHERE user_type = "professor"'
    );

    res.json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCurrentUser,
  patchCurrentUser,
  getStudents,
  getProfessors,
  deleteUser,
};
