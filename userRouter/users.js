const express = require('express');
const userDb = require('../database/userDb.js');
const router = express.Router();

router.get('/users', async (req, res) => {

    try {
        const users = await userDb('users');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to get users' });
    }
});

module.exports = router;