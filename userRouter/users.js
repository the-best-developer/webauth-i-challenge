const express = require('express');
const userDb = require('../database/userDb.js');
const router = express.Router();
const bcrypt = require('bcryptjs')

router.get('/users', async (req, res) => {

    try {
        const users = await userDb('users');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get users' });
    }
});

router.post('/register', async (req, res) => {
    let user = req.body;
    
        try{
            // Check for username and password
            if (!user.username || !user.password) {
                res.status(500).json({message: "missing username or password"})
                return null;
            }
            // Hash password
            user.password = bcrypt.hashSync(user.password, 10);
            // Add user to database using hashed password
            const addUser = await userDb('users').insert(user);
            // Check for problems
            if (!addUser) {
                res.status(500).json({message: "Could not add user"})
                return null;
            };
            // Select newly added user and return it
            const selectUser = await userDb('users').where({id: addUser[0]}).first();
            // Check for problems
            if (!selectUser) {
                res.status(500).json({message: "Could not find new user"})
                return null;
            };
            // Return new user
            res.status(200).json(selectUser);
        }
        catch (err) {
            res.status(500).json({err: err.message})
        }
  });

function isLoggedIn(req, res, next) {
    
    next();
  }

module.exports = router;