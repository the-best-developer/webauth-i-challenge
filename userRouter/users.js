const express = require('express');
const userDb = require('../database/userDb.js');
const router = express.Router();
const bcrypt = require('bcryptjs')

const isLoggedIn = async (req, res, next) => {
    // Check for session
    if (req.session && req.session.user) {
        next()
    }
    else {
        return res.status(500).json({ message: 'Not logged in' });
    }
}

router.get('/users', isLoggedIn, async (req, res) => {
    
    try {
        // Select and return all users in database
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
            return res.status(500).json({message: "missing username or password"});
        }
        // Hash password
        user.password = bcrypt.hashSync(user.password, 10);
        // Add user to database using hashed password
        const addUser = await userDb('users').insert(user);
        // Check for problems
        if (!addUser) {
            return res.status(500).json({message: "Could not add user"});
        };
        // Select newly added user and return it
        const selectUser = await userDb('users').where({id: addUser[0]}).first();
        // Check for problems
        if (!selectUser) {
            return res.status(500).json({message: "Could not find new user"});
        };
        // Return new user
        return res.status(200).json(selectUser);
    }
    catch (err) {
        return res.status(500).json({err: err.message});
    }
});

router.post('/login', async (req, res) => {
    let user = req.body;

    try{
        // Check for username and password
        if (!user.username || !user.password) {
            return res.status(500).json({message: "missing username or password"});
        }
        // Select username matching the post data
        const selectUser = await userDb('users').where({ username: user.username }).first();
        // Check for problems
        if (!selectUser) {
            return res.status(500).json({message: "Could not find new user"});
        };
        // Compare saved user hash and post data user hash
        if (!bcrypt.compareSync(user.password, selectUser.password)) {
            return res.status(500).json({message: "You shall not pass!"});
        }
        // Logged in!
        
        req.session.user = user.username;
        return res.status(200).json({message: `Logged in as ${selectUser.username}!`});
    }
    catch (err) {
        return res.status(500).json({err: err.message});
    }
});

router.get('/logout', isLoggedIn, async (req, res) => {

    if (req.session && req.session.user) {
        const thisUser = req.session.user;

        req.session.destroy();
        return res.status(200).json({message: `Successfully logged out as ${thisUser}!`});
    }
    else {
        return res.status(500).json({ message: 'Not logged in' });
    }
});

module.exports = router;