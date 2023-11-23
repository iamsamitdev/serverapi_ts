import { Request, Response } from "express"
import multer from "multer"
import multerConfig from "../utils/multer_config"
import connection from "../utils/db"

const upload = multer(multerConfig.config).single(multerConfig.keyUpload)

//----------------------------------------
// Get all products
//----------------------------------------
function getAllProducts(req: Request, res: Response) {
  try {
    connection.execute(
      "SELECT * FROM products ORDER BY id DESC",
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          res.json(results);
        }
      }
    );
  } catch (err) {
    console.error("Error storing product in the database: ", err);
    res.sendStatus(500);
  }
}

//----------------------------------------
// Get product by id
//----------------------------------------
function getProductById(req: Request, res: Response) {
  try {
    connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [req.params.productId],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          res.json(results)
        }
      }
    )
  } catch (err) {
    console.error("Error storing product in the database: ", err)
    res.sendStatus(500)
  }
}

//----------------------------------------
// Create product
//----------------------------------------
function createProduct(req: Request, res: Response) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(`error: ${JSON.stringify(err)}`)
      return res.status(500).json({ message: err })
    } else if (err) {
      console.log(`error: ${JSON.stringify(err)}`)
      return res.status(500).json({ message: err })
    } else {
      // console.log(`file: ${JSON.stringify(req.file)}`)
      // console.log(`body: ${JSON.stringify(req.body)}`)
      try {
        const {
          name,
          description,
          barcode,
          stock,
          price,
          category_id,
          user_id,
          status_id,
        } = req.body
        const image = req.file ? req.file.filename : null
        console.log(req.file)
        connection.execute(
          "INSERT INTO products (name, description, barcode, image, stock, price, category_id, user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            description,
            barcode,
            image,
            stock,
            price,
            category_id,
            user_id,
            status_id,
          ],
          function (err, results: any) {
            if (err) {
              res.json({ status: "error", message: err })
              return
            } else {
              res.json({
                status: "ok",
                message: "Product created successfully",
                product: {
                  id: results.insertId,
                  name: name,
                  description: description,
                  barcode: barcode,
                  image: image,
                  stock: stock,
                  price: price,
                  category_id: category_id,
                  user_id: user_id,
                  status_id: status_id,
                },
              })
            }
          }
        )
      } catch (err) {
        console.error("Error storing product in the database: ", err)
        res.sendStatus(500)
      }
    }
  })
}

//----------------------------------------
// Update product
//----------------------------------------
function updateProduct(req: Request, res: Response) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(`error: ${JSON.stringify(err)}`)
      return res.status(500).json({ message: err })
    } else if (err) {
      console.log(`error: ${JSON.stringify(err)}`)
      return res.status(500).json({ message: err })
    } else {
      console.log(`file: ${JSON.stringify(req.file)}`)
      console.log(`body: ${JSON.stringify(req.body)}`)
      try {
        const {
          name,
          description,
          barcode,
          stock,
          price,
          category_id,
          user_id,
          status_id,
        } = req.body
        const image = req.file ? req.file.filename : null
        // console.log(req.file)

        let sql =
          "UPDATE products SET name = ?, description = ?, barcode = ?, stock = ?, price = ?, category_id = ?, user_id = ?, status_id = ? WHERE id = ?"
        let params = [
          name,
          description,
          barcode,
          stock,
          price,
          category_id,
          user_id,
          status_id,
          req.params.productId,
        ]

        if (image) {
          sql =
            "UPDATE products SET name = ?, description = ?, barcode = ?, image = ?, stock = ?, price = ?, category_id = ?, user_id = ?, status_id = ? WHERE id = ?"
          params = [
            name,
            description,
            barcode,
            image,
            stock,
            price,
            category_id,
            user_id,
            status_id,
            req.params.productId,
          ]
        }

        connection.execute(sql, params, function (err) {
          if (err) {
            res.json({ status: "error", message: err })
            return
          } else {
            res.json({
              status: "ok",
              message: "Product updated successfully",
              product: {
                id: req.params.productId,
                name: name,
                description: description,
                barcode: barcode,
                image: image,
                stock: stock,
                price: price,
                category_id: category_id,
                user_id: user_id,
                status_id: status_id,
              },
            })
          }
        })
      } catch (err) {
        console.error("Error storing product in the database: ", err)
        res.sendStatus(500)
      }
    }
  })
}

//----------------------------------------
// Delete product
//----------------------------------------
function deleteProduct(req: Request, res: Response) {
  try {
    connection.execute(
      "DELETE FROM products WHERE id = ?",
      [req.params.productId],
      function (err) {
        if (err) {
          res.json({ status: "error", message: err })
          return
        } else {
          res.json({
            status: "ok",
            message: "Product deleted successfully",
            product: {
              id: req.params.productId,
            },
          })
        }
      }
    )
    // Delete file from server
    const fs = require("fs")
    const path = require("path")
    const filePath = path.join(
      __dirname,
      "../public/uploads/",
      req.params.productId
    )
  } catch (err) {
    console.error("Error storing product in the database: ", err)
    res.sendStatus(500)
  }
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
