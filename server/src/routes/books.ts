import express, { Request, Response } from 'express';
import mysql, { QueryResult, ResultSetHeader } from 'mysql2';
import {Book} from '../interfaces/Interfaces.ts'

const router = express.Router();

// DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'onedirdir',
    database: 'library'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

////// GET



//Get Books pg
router.get('/', (req: Request, res: Response) => {
    const pg = parseInt(req.query.pg as string) || 0;
    const limit = parseInt(req.query.limit as string) || 0;

    // books count
    const countQuery = 'SELECT COUNT(*) AS total FROM books';
    db.query(countQuery, (err, countResults : any) => {
        if (err) {
            console.error('Query error: ', err);
            return res.status(500).send('Internal server error');
        }

        // get books current page
        const query = 'SELECT * FROM books LIMIT ? OFFSET ?';
        db.query(query, [limit, pg], (err, results) => {
            if (err) {
                console.error('Query error: ', err);
                return res.status(500).send('Internal server error');
            }
            res.json({
                books: results,
                total: countResults[0].total
            });
        });
    });
});


//Get all books
router.get('/', (req: Request, res: Response) => {
    console.log('Get all books')
    const query = 'SELECT * FROM books';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Query error: ', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Get count
router.get('/count', (req: Request, res: Response) => {
    const query = 'SELECT COUNT(*) AS total FROM books';
    db.query(query, (err, results : any) => {
      if (err) {
        console.error('Query error: ', err);
        return res.status(500).send('Internal server error');
      }
      console.log('Count '+ results[0].total)
      res.json(results[0].total)
      
    });
  });
  

/////POST

// Add book
router.post('/add', (req: Request, res: Response) => {
    const book: Book = req.body;

    if (!book.title || !book.author || !book.publication_year || !book.price) {
        return res.status(400).send('Undefined data: ' + 
            '\n\ttitle: ' + book.title + ' author: ' + book.author + '\n\tpublication_year: ' + book.publication_year + '\n\tprice: ' + book.price);
    }

    const query = 'INSERT INTO books (title, author, publication_year, price) VALUES (?, ?, ?, ?)';

    db.query(query, [book.title, book.author, book.publication_year, book.price], (err) => {
        if (err) {
            console.error('Query Error: ', err);
            return res.status(500).send('Server error');
        }
        res.status(201).send('Book successfully added');
    });
});


///// PUT

// Modify book by id
router.put('/update/:id', (req: Request, res: Response) => {
    const bookId = req.params.id;
    const book: Book = req.body;

    if (!book.title || !book.author || !book.publication_year || !book.price) {
        console.log(book)
        return res.status(400).send('All data are mandatory')
    }

    const query = `
        UPDATE books
        SET title = ?, author = ?, publication_year = ?, price = ?
        WHERE book_id = ?
    `;

    db.query(query, [book.title, book.author, book.publication_year, book.price, bookId], (err, results : ResultSetHeader) => {
        if (err) {
            console.error('Query Error: ', err);
            return res.status(500).send('Internal server error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Book not found');
        }

        res.status(201).send('Book successfully updated');
    });
});


/////// DELETE

// Delete book by ID
router.delete('/remove/:id', (req: Request, res: Response) => {
    const bookId = req.params.id

    const query = 'DELETE FROM books WHERE book_id = ?'

    db.query(query, [bookId], (err, results : ResultSetHeader) => {
        if (err) {
            console.error('Query Error: ', err);
            return res.status(500).send('Internal server error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Book not found')
        }

        res.send('Book successfully deleted')
    });
});

export default router;
