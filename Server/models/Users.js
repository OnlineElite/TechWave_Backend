const pool = require('../config/db')

class Users {

    static async importUsers(){
        const query = `select * from users where deleted_date is null`
        const result = await pool.query(query);
        return result.rows;
    }

    static async updateUser(user){
        const query = `update users set first_name = '${user.first_name}', last_name = '${user.last_name}', 
        admin = ${user.admin}, updated_date = CURRENT_TIMESTAMP where username = '${user.condition}' `;
        const result = await pool.query(query)
        return result.rows;
    }

    static async deleteUser(condition){
        //const query = `delete from users where username = '${condition}' `;
        const query = `update users set deleted_date = CURRENT_TIMESTAMP where username = '${condition}' `;
        const result = await pool.query(query)
        return result.rows;
    }
}


module.exports = Users;