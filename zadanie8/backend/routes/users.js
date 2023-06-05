const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secretKey = 'superSecretKey';

users = [
    {id: 1, name: 'admin', email: 'admin@admin.com', password: 'admin'},
    {id: 2, name: 'user', email: 'user@user.com', password: 'user'},
]

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    const user = users.find((a) => {
        return a.email === email && a.password === password
    });

    if (user) {
        const token = jwt.sign({userId: user.id}, secretKey);
        res.status(200)
        res.json({token});
    } else {
        res.status(403)
        res.json({message: 'Nieprawidłowa nazwa użytkownika lub hasło'});
    }
});

router.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    const user = users.find((a) => {
        return a.email === email
    });


    if (user) {
        res.status(409)
        res.json({message: 'Użytkownik o podanym emailu istnieje'});
    } else {
        const newUser = {id: users.length + 1, name, email, password};
        users.push(newUser);
        res.status(200)
        res.json({})
    }
});

module.exports = router;
