import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import connection from "../utils/db" // Ensure this file is also converted to TypeScript

// Define types for the user inputs
interface UserInput {
  firstname: string
  lastname: string
  email: string
  password: string
}

// Register function
async function register(req: Request, res: Response): Promise<void> {
  const { firstname, lastname, email, password }: UserInput = req.body

  // Check if the user already exists
  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, results: any, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          if (results.length > 0) {
            res.json({ status: "error", message: "Email already exists" })
            return
          } else {
            // Hash the password
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) {
                res.json({ status: "error", message: err })
                return
              } else {
                // Store the user in the database
                const query =
                  "INSERT INTO users (firstname, lastname, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"
                const values = [firstname, lastname, email, hash]

                // Insert the new user into the database
                connection.execute(
                  query,
                  values,
                  function (err, results: any, fields) {
                    if (err) {
                      res.json({ status: "error", message: err })
                      return
                    } else {
                      // Generate JWT token for the registered user
                      const token = jwt.sign(
                        { email },
                        process.env.JWT_SECRET || ""
                      )

                      res.json({
                        status: "ok",
                        message: "User registered successfully",
                        token: token,
                        user: {
                          id: results.insertId,
                          firstname: firstname,
                          lastname: lastname,
                          email: email,
                        },
                      })
                    }
                  }
                )
              }
            })
          }
        }
      }
    )
  } catch (err) {
    console.error("Error storing user in the database: ", err)
    res.sendStatus(500)
  }
}

// Login function
async function login(req: Request, res: Response): Promise<void> {
  const { email, password }: UserInput = req.body

  try {
    connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, results: any, fields) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          if (results.length > 0) {
            // Compare the password with the hash
            bcrypt.compare(
              password,
              results[0].password,
              function (err, result) {
                if (err) {
                  res.json({ status: "error", message: err })
                  return
                } else {
                  if (result) {
                    // Generate JWT token for the registered user
                    const token = jwt.sign(
                      { email },
                      process.env.JWT_SECRET || ""
                    )

                    res.json({
                      status: "ok",
                      message: "User logged in successfully",
                      token: token,
                      user: {
                        id: results[0].id,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        email: results[0].email,
                      },
                    })
                  } else {
                    res.json({
                      status: "error",
                      message: "Email and password does not match",
                    })
                    return
                  }
                }
              }
            )
          } else {
            res.json({ status: "error", message: "Email does not exists" })
            return
          }
        }
      }
    )
  } catch (err) {
    console.error("Error querying the database: ", err)
    res.sendStatus(500)
  }
}

export { register, login }
