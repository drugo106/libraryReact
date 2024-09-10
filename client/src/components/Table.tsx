import React, { useState, useEffect } from 'react';
import Row from './Row';
import AddBookModal from './AddBookModal'; // Importa il nuovo componente
import '../styles/Row.css';
import useWindowSize from '../hooks/WindowSize.tsx'; // Importa il tuo hook

interface Book {
  title: string;
  author: string;
  review?: string;
  publication_year: string;
  price: string;
}

const Table: React.FC = () => {
  const { width } = useWindowSize(); // Usa il hook per ottenere la larghezza della finestra
  const [bookData, setBookData] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Stato per il modale

  const itemsPerPage = Math.floor(width / 140); // Regola 200 in base alla larghezza media della riga

  const fetchBooks = async (pg: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/books?pg=${pg * itemsPerPage}&limit=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      const data = await response.json();
      setBookData(data.books);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page, itemsPerPage]);

  const nextPage = () => {
    if (page + 1 < totalPages) setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  const handleAddBook = async (book: { title: string; author: string; review: string; publication_year: string; price: string }) => {
    try {
      const response = await fetch('http://localhost:3001/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      fetchBooks(page); // Ricarica i libri dopo l'aggiunta
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded"
      >
        Aggiungi Libro
      </button>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b bg-sky-200">
            <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Book</th>
            <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Author</th>
            <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Review</th>
            <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Publication Year</th>
            <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Price</th>
          </tr>
        </thead>
        <tbody>
          {bookData.map((book, index) => (
            <Row
              key={index}
              title={book.title}
              author={book.author}
              review={'★★★★★'}
              publication_year={book.publication_year}
              price={book.price}
            />
          ))}
        </tbody>
      </table>

      {/* Sezione di paginazione */}
      <div className="flex justify-between items-center w-full mt-4">
        <button
          onClick={prevPage}
          className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={page === 0}
        >
          Pagina precedente
        </button>

        {/* Indicatore della pagina corrente */}
        <span className="text-gray-700 font-semibold">
          Pagina {page + 1} di {totalPages}
        </span>

        <button
          onClick={nextPage}
          className={`px-4 py-2 bg-gray-500 text-white rounded ${page + 1 >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={page + 1 >= totalPages}
        >
          Pagina successiva
        </button>
      </div>

      {/* Modale per aggiungere un libro */}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
};

export default Table;
