import React, { useState, useEffect } from 'react';
import {Book} from '../../interfaces/Interfaces.ts'


interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (book: Book) => void;
  book?: Book;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, onUpdateBook, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publication_year, setPublicationYear] = useState('');
  const [price, setPrice] = useState('');
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPublicationYear(book.publication_year);
      setPrice(book.price);
    }
  }, [book]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (book) {
      const updatedBook = { id: book.id, title, author, publication_year, price };
      onUpdateBook(updatedBook);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Modifica Libro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Publication Year</label>
            <input
              type="text"
              value={publication_year}
              onChange={(e) => setPublicationYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2">
              Annulla
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Aggiorna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
