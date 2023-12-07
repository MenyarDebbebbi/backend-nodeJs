const query = require("../services/db.js");
const emptyOrRows = require("../helpers/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signIn = async (req,res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await query(
            'SELECT * FROM user WHERE user_email = ?',
            [email]
        );
        
        const existingEmails = emptyOrRows(rows);

        if (existingEmails.length === 0) {
            return res.status(401).json({ message: 'Email is invalid' });
        }

        const match = await bcrypt.compare(password, existingEmails[0].user_password);
    

        if (!match) {
            return res.status(401).json({ message: 'Password is invalid' });
        }

        const access_token = jwt.sign({ email:rows.user_email , id: rows.user_id }, 'smarteducation');

        const data = {
            id: rows.user_id,
            name: rows.user_name,
            email: rows.user_email,
            account_type: rows.user_type
        }
        res.status(200).json({
            message: 'Sign-in successful',
            result: {
            data,
            access_token,
            }
        });
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

const signUp = async (req, res) => {
    try {
        const { name, email, account_type, password } = req.body;

        const [rows] = await query('SELECT * FROM user WHERE user_email = ?', [email]);

        const existingUsers = emptyOrRows(rows);


        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'INSERT INTO user (user_name, user_email, user_type, user_password, created_at) VALUES (?, ?, ?, ?, ?)',
             [name, email, account_type, hashedPassword, Date.now()]
        );

        const id = result.insertId;

        if (account_type === 'student') {
            await query('INSERT INTO student (st_id) VALUES (?)', [id]);
        } else if (account_type === 'professor') {
            await query('INSERT INTO professor (p_id) VALUES (?)', [id]);
        }

        const access_token = jwt.sign(
            {email:result.user_email , id: result.user_id },
            'smarteducation',
            { expiresIn: '24h'}
            );

        res.status(201).json({
            message: 'Sign-up successful',
            result: {
            data: {
                id,
                name,
                email,
                account_type
            },
            access_token
        }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signIn,
    signUp
}