const {
    generateConfirmToken, 
    authenticateConfirmToken, 
    generateAccessToken, 
    authenticateLoginToken
} = require('../utils/token');
const hashPassword = require('../utils/hashPassword')
const {validateRegisterData} = require('../utils/validateAuth')
const user = new (require('../models/users'))()
const sendLetter = require('../utils/nodemailer')
const config = require('../config.json')

module.exports = {
    async register(req, res) {
        let data = req.body;
        let err = validateRegisterData(data);

        if (err) {
            res.sendStatus(400);
            return;
        }
        if ((await user.find({login: data.login})).length != 0) {
            res.status(409).json({
                status: 409,
                message: "login already exists"
            });
            return;
        }
        if ((await user.find({email: data.email})).length != 0 || (await user.find({email: 'unconfirmed@'+data.email})).length != 0) {
            res.status(409).json({
                status: 409,
                message: "email already exists"
            });
            return;
        }

        if((!req.user || req.user.role !== 'admin') && data.role === 'admin') {
            res.sendStatus(403);
            return;
        }
        const email = data.email;
        data.email = `unconfirmed@${email}`;
        const id = (await user.save(data)).id;

        let confirmToken = generateConfirmToken({id, email, login: data.login});
        let message = `
        Hi,
        Thank you for signing up with usof.
        To complete your account set-up, please verify your email address by clicking on the confirmation link below.
        Confirmation Link:
        http://localhost:${config.port}/api/auth/confirm-email/${confirmToken}
        *** If for any reason the above link is not clickable, please copy the link and paste it in your choice of browser.
        Best regards,
        - Anton Chaika
        `;
        sendLetter(email, 'Confirm email', message);

        res.sendStatus(200);
    },

    async login(req, res) {
        let data = req.body;
        if (data.token && await authenticateLoginToken(data.token)) {
            res.cookie("token", data.token);
            res.sendStatus(200);
            return;
        }
        if((!data.login && !data.email)|| !data.password) {
            res.sendStatus(400);
            return;
        }

        data.password = hashPassword(data.password);
        let userData = await user.find({login: data.login, password: data.password});
        if (userData.length == 0) {
            res.sendStatus(401);
            return;
        }
        if(userData.email.match(/unconfirmed@([^\s]+)@([^\s^.]+).([^\s]+)/gm)) {
            res.status(403).json({error: 403, message: "please, confirm your email address"});
            return;
        }

        const token = generateAccessToken({login: userData.login, id: userData.id, role: userData.role});
        res.cookie("token", token);
        res.cookie("id", userData.id);
        res.sendStatus(200);
    },

    logout(req, res) {
        if (!req.cookies.token) {
            res.sendStatus(401);
            return
        }
        res.clearCookie('token');
        res.sendStatus(204);
    },

    async passwordReset(req, res) {
        let data = req.body;
        if (!data.email) {
            res.sendStatus(400);
            return;
        }
        if ((await user.find({email: data.email})).length == 0) {
            res.sendStatus(404);
            return;
        }

        let confirmToken = generateConfirmToken({email: data.email});

        let message = `
        Hi,
        Thank you for signing up with usof.
        To complete your account set-up, please verify your email address by clicking on the confirmation link below.
        Confirmation Post URL:
        http://localhost:${config.port}/api/auth/password-reset/${confirmToken}
        *** If for any reason the above link is not clickable, please copy the link and paste it in your choice of browser.
        Best regards,
        - Anton Chaika
        `;
        sendLetter(data.email, 'Confirm email', message);

        res.sendStatus(200);
    },

    async confirmEmail(req, res) {
        let token = req.params.confirmToken;
        let data = authenticateConfirmToken(token)
        if (!token || !data) {
            res.sendStatus(403);
            return;
        }
        delete data.iat;
        delete data.exp;

        await user.save(data);
        res.sendStatus(200);
    },

    async confirmNewPassword(req, res) {
        let newPassword = req.body.newPassword;
        if (!newPassword || newPassword.length < 8) {
            res.sendStatus(400);
            return;
        }
        
        let token = req.params.confirmToken;
        let data = authenticateConfirmToken(token)
        
        if (!token || !data) {
            res.sendStatus(400);
            return;
        }
        let userData = await user.find({email: data.email});
        
        userData.password = hashPassword(newPassword);
        if(await user.save(userData) == -1) {
            res.sendStatus(400);
            return
        }
        res.sendStatus(200);
    }
}