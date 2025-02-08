import { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as number | undefined

  if (process.env.NODE_ENV === 'development') {
    req.user = {
      id: Number(userId) || 1
    }

    return next()
  }

  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' })
    return
  }

  req.user = {
    id: Number(userId)
  }

  next()
}
