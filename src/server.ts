import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import errorHandler from './common/error/errorHandler';
import customError from './common/error/customError';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 

// Middleware xử lý body của request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new customError(500, 'Test error'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
