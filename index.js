import { config } from 'dotenv';
import express from 'express';

config();

const port = process.env.SERVER_PORT
const app = express();

app.use(express.json());



app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});