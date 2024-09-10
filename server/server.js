"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql2_1 = __importDefault(require("mysql2"));
// Configurazione della connessione al database
const db = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root', // Sostituisci con il tuo username MySQL
    password: 'onedirdir', // Sostituisci con la tua password MySQL
    database: 'library' // Sostituisci con il nome del tuo database
});
// Connessione al database
db.connect((err) => {
    if (err) {
        console.error('Errore di connessione al database: ', err);
        return;
    }
    console.log('Connesso al database MySQL!');
});
// Inizializzazione di Express
const app = (0, express_1.default)();
const port = 3000;
// API GET per ottenere tutti i libri
app.get('/api/books', (req, res) => {
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Errore nella query: ', err);
            return res.status(500).send('Errore del server');
        }
        res.json(results);
    });
});
// Avvia il server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
