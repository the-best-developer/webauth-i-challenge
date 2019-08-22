const express = require('express');
const userDb = require('../database/userDb.js');
const router = express.Router();
const bcrypt = require('bcryptjs')

const isLoggedIn = async (req, res, next) => {
    const user = req.headers;
    // Check for username and password
    if (!user.username || !user.password) {
        return res.status(500).json({message: "Please log in :)"})
    }
    // Select user matching header data
    const selectUser = await userDb('users').where({ username: user.username }).first();
    // Check for problems
    if (!selectUser) {
        return res.status(500).json({message: "Could not find new user"})
    };
    // Check if password of selected user matches header password
    if (!bcrypt.compareSync(user.password, selectUser.password)) {
        return res.status(500).json({message: "Incorrect password"})
    }
    // If logged in, continue
    next();
}

router.get('/users', isLoggedIn, async (req, res) => {

    try {
        const users = await userDb('users');
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to get users' });
    }
});

router.post('/register', async (req, res) => {
    let user = req.body;

    try{
        // Check for username and password
        if (!user.username || !user.password) {
            return res.status(500).json({message: "missing username or password"})
        }
        // Hash password
        user.password = bcrypt.hashSync(user.password, 10);
        // Add user to database using hashed password
        const addUser = await userDb('users').insert(user);
        // Check for problems
        if (!addUser) {
            return res.status(500).json({message: "Could not add user"})
        };
        // Select newly added user and return it
        const selectUser = await userDb('users').where({id: addUser[0]}).first();
        // Check for problems
        if (!selectUser) {
            return res.status(500).json({message: "Could not find new user"})
        };
        // Return new user
        return res.status(200).json(selectUser);
    }
    catch (err) {
        return res.status(500).json({err: err.message})
    }
});

router.post('/login', async (req, res) => {
    let user = req.body;

    try{
        // Check for username and password
        if (!user.username || !user.password) {
            return res.status(500).json({message: "missing username or password"})
        }
        // Select username matching the post data
        const selectUser = await userDb('users').where({ username: user.username }).first();
        // Check for problems
        if (!selectUser) {
            return res.status(500).json({message: "Could not find new user"})
        };
        // Compare saved user hash and post data user hash
        if (!bcrypt.compareSync(user.password, selectUser.password)) {
            return res.status(500).json({message: "Incorrect password"})
        }
        // Logged in!
        return res.status(500).json({message: `Logged in as ${selectUser.username}!`})
    }
    catch (err) {
        return res.status(500).json({err: err.message})
    }
});

module.exports = router;