import mysql, { ConnectionOptions } from "mysql2"

const connectionConfig: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_DATABASE,
}

const connection = mysql.createConnection(connectionConfig)

connection.connect((error: Error | unknown) => {
  if (error) {
    console.error("Error connecting to MySQL database: ", error)
  } else {
    // console.log('Connected to MySQL database!')
  }
})

export default connection
