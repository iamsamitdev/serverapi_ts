// Define an interface for the product data
interface ProductData {
  name: string
  description: string
  barcode: string
  image: string | null
  stock: number
  price: number
  categoryId: number
  userId: number
  statusId: number
}

class Product {
  name: string
  description: string
  barcode: string
  image: string | null
  stock: number
  price: number
  categoryId: number
  userId: number
  statusId: number

  constructor(data: ProductData) {
    this.name = data.name
    this.description = data.description
    this.barcode = data.barcode
    this.image = data.image
    this.stock = data.stock
    this.price = data.price
    this.categoryId = data.categoryId
    this.userId = data.userId
    this.statusId = data.statusId
  }
}

export default Product
