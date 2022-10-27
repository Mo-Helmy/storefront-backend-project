import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app: express.Application = express();
const address = 'http://localhost:3000';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', routes);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
