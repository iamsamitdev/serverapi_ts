import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// Extend the Express Request type with the user property
interface RequestWithUser extends Request {
  user?: JwtPayload | string
}

function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.json({
      message: 'Unauthorized',
      status: 401,
    })
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, user) => {
    if (err) {
      return res.json({
        message: 'Forbidden',
        status: 403,
      })
    }
    req.user = user
    next()
  })
}

export default authenticateToken

