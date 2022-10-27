import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      jwt.verify(token, process.env.TOKEN_SECRET as string);
      // console.log('authentication sucessfull');
      next();
    } catch (error) {
      console.log('unsucessfull');

      res.status(401).json('authentication failed Error:' + error);
    }
  } else {
    console.log('unsucessfull');
    res.status(401).json('authentication failed');
  }
};

export default authenticate;
