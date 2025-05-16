import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import emergencyRoutes from './routes/emergencyRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', emergencyRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Respondr Backend API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});