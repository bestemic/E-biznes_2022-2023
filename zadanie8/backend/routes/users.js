const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {AuthorizationCode} = require("simple-oauth2");
const axios = require("axios");

const jwtSecretKey = process.env.JWT_KEY;

users = [
    {id: 1, name: 'admin', email: 'admin@admin.com', password: 'admin'},
    {id: 2, name: 'user', email: 'user@user.com', password: 'user'},
]

const database = {};

const oauth2ConfigGoogle = {
    client: {
        id: process.env.CLIENT_ID_GOOGLE,
        secret: process.env.CLIENT_SECRET_GOOGLE,
    },
    auth: {
        tokenHost: 'https://accounts.google.com',
        tokenPath: '/o/oauth2/token',
        authorizePath: '/o/oauth2/auth',
    },
};

const oauth2ConfigGithub = {
    client: {
        id: process.env.CLIENT_ID_GITHUB,
        secret: process.env.CLIENT_SECRET_GITHUB,
    },
    auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
    },
};

const oauth2ClientGoogle = new AuthorizationCode(oauth2ConfigGoogle);
const oauth2ClientGithub = new AuthorizationCode(oauth2ConfigGithub);

function saveToDb(id, token, oauth, isOauth) {
    if (database[id]) {
        database[id].token = token;
        database[id].oauth = oauth;
        database[id].isOauth = isOauth;
    } else {
        database[id] = {token, oauth, isOauth};
    }
}

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    const user = users.find((a) => {
        return a.email === email && a.password === password
    });

    if (user) {
        const token = jwt.sign({userId: user.id}, jwtSecretKey);
        saveToDb(user.id, token, '', false);
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

router.get('/login/google', (req, res) => {
    const authorizationUri = oauth2ClientGoogle.authorizeURL({
        redirect_uri: 'http://localhost:3000/users/login/google/callback',
        scope: 'profile',
    });

    res.redirect(authorizationUri);
});

router.get('/login/google/callback', async (req, res) => {
    const {code} = req.query;
    const options = {
        code,
    };

    try {
        const accessToken = await oauth2ClientGoogle.getToken(options);
        const user = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo`,
            {
                headers: {
                    Authorization: 'Bearer ' + accessToken.token.access_token
                }
            }
        )
            .then((res) => res.data)
            .catch((error) => {
                console.error(`Failed to fetch user`);
                throw new Error(error.message);
            });

        const token = jwt.sign(user.id, jwtSecretKey);
        saveToDb(user.id, token, accessToken.token.access_token, true);

        res.cookie('token', token);
        return res.redirect('http://localhost:5173')
    } catch (error) {
        console.error('Access Token Error', error.message);
        return res.status(500).json('Authentication failed');
    }
});

router.get('/login/github', (req, res) => {
    const authorizationUri = oauth2ClientGithub.authorizeURL({
        redirect_uri: 'http://localhost:3000/users/login/github/callback',
        scope: 'profile',
    });

    res.redirect(authorizationUri);
});

router.get('/login/github/callback', async (req, res) => {
    const {code} = req.query;
    const options = {
        code,
    };

    try {
        const accessToken = await oauth2ClientGithub.getToken(options);
        const user = await axios.get(
            `https://api.github.com/user`,
            {
                headers: {
                    Authorization: 'Bearer ' + accessToken.token.access_token
                }
            }
        )
            .then((res) => res.data)
            .catch((error) => {
                console.error(`Failed to fetch user`);
                throw new Error(error.message);
            });

        const token = jwt.sign(user.id, jwtSecretKey);
        saveToDb(user.id, token, accessToken.token.access_token, true);

        res.cookie('token', token);
        return res.redirect('http://localhost:5173')
    } catch (error) {
        console.error('Access Token Error', error.message);
        return res.status(500).json('Authentication failed');
    }
});

module.exports = router;