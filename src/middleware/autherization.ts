import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const autherization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.params.userId ? req.params.userId : req.body.user_id;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET as string);

      if ((payload as JwtPayload).user.id === parseInt(userId)) {
        next();
      } else {
        res
          .status(401)
          .json(
            'autherization failed Error: you tring to access data for another user'
          );
      }
    } catch (error) {
      res.status(401).json('authentication failed Error:' + error);
    }
  } else {
    res.status(401).json('authentication failed');
  }
};

export default autherization;
