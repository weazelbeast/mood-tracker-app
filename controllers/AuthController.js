const {User} = require('../models')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).json({message: "success"})
    } catch (err) {
        
        res.status(400).json(err.errors)
    }
}

const login = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        
        try {
            if(err) console.error(err)
            if(info !== undefined) return res.status(401).json(info)
            req.login(user, {session: false}, async error => {
                if(error) return next(error)
                const body = {id: user.id, username: user.email}
                const token = jwt.sign({user: body}, process.env.API_SECRET)
                return res.json({token})
            })
        } catch (err) {
            return next(err)
        }
    })(req, res, next)
}

const logout = (req, res) => {
    if(req.user) {
        req.logout()
        res.json({message: "you have been successfully logged out"})
    } else {
        res.json({})
    }
}

module.exports = {
    registerUser,
    login, 
    logout
}