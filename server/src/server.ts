import express, { Request, Response, NextFunction } from 'express';
import booksRouter from './routes/books';
import cors from 'cors'; 

const app = express();
const port = 3001;

// enable cors origin on my client
app.use(cors({
    origin: 'http://localhost:3000'
}));

// covert request body injson
app.use(express.json());

// Routes
app.use('/api/books', booksRouter);

// Middleware errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong -> \n' + err.stack);
});

// Start Server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
