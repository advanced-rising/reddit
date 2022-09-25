import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const origin = 'http://localhost:3000';
app.use(
  cors({
    origin,
    credentials: true,
  })
);

dotenv.config();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);

const port = 4000;
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log('Inserting a new user into the database...');
      console.log('Loading users from the database...');
    })
    .catch((error) => console.log(error));
});
