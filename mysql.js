require('dotenv').config()

const mysql = require('mysql')

module.exports = async () => {
    mysql.createConnection({
        host:  process.env.MYSQL_SERVER,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
        charset: "utf8mb4"
    })

    return mysql
}