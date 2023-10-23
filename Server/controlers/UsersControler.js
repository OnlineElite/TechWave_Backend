const pool = require('../config/db');
const Users = require('../models/Users.js')


async function getUsers(req, res){

    try{
        
        const users = await Users.importUsers()
        res.status(201).json({Users : users})

    }catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

async function updatingUser(req, res){
    try{
        await Users.updateUser(req.body.user)
        res.status(201).json({ message: 'User updated successfully' });

    }catch(error){
        console.error(error)
        res.status(500).json({error : 'Internal server error'})
    }
}

async function deletingUser(req, res){
    try{
        await Users.deleteUser(req.body.condition)
        res.status(201).json({ message: 'User delete successfully' });

    }catch(error){
        console.error(error)
        res.status(500).json({error : 'Internal server error'})
    }
}

module.exports = {getUsers, updatingUser, deletingUser}