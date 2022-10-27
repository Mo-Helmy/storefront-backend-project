import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app: express.Application = express();
const port = process.env.SERVER_PORT;
const address = `http://localhost:${port}`;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', routes);

app.get('/', function (req: Request, res: Response) {
  res.send('check README.me file for instructions');
});

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
