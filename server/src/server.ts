import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import subsRoutes from './routes/subs';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
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
app.use(cookieParser());

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRoutes);
app.use('/api/subs', subsRoutes);

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
