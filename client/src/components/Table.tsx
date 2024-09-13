import React, { useState, useEffect } from 'react';
import Row from './Row';
import AddBookModal from './modals/AddBookModal';
import EditBookModal from './modals/EditBookModal';
import useWindowSize from '../hooks/WindowSize.tsx';
import { Book, BookItem } from '../interfaces/Interfaces.ts';

const Table: React.FC = () => {
    const { width } = useWindowSize();
    const [bookData, setBookData] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);

    // Filters state
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [authorFilter, setAuthorFilter] = useState<string>('');
    const [publicationYearFilter, setPublicationYearFilter] = useState<string>('');
    const [priceFilter, setPriceFilter] = useState<string>('');

    const itemsPerPage = Math.floor(width / 190);

    const fetchBooks = async (pg: number) => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/books?pg=${pg * itemsPerPage}&limit=${itemsPerPage}&title=${titleFilter}&author=${authorFilter}&publication_year=${publicationYearFilter}&price=${priceFilter}`);
            if (!response.ok) {
                throw new Error('Request error');
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
    }, [page, itemsPerPage, titleFilter, authorFilter, publicationYearFilter, priceFilter]);

    const nextPage = () => {
        if (page + 1 < totalPages) setPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage((prevPage) => prevPage - 1);
    };

    const handleAddBook = async (book: BookItem) => {
        try {
            const response = await fetch('http://localhost:3001/api/books/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });
            if (!response.ok) {
                throw new Error('Request error');
            }
            setIsAddModalOpen(false);
            fetchBooks(page);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateBook = async (book: Book) => {
        try {
            const response = await fetch(`http://localhost:3001/api/books/update/${book.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });
            if (!response.ok) {
                throw new Error('Request error');
            }
            setIsEditModalOpen(false);
            fetchBooks(page);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const openEditModal = (book: Book) => {
        setCurrentBook(book);
        setIsEditModalOpen(true);
    };

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
                Aggiungi Libro
            </button>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Titolo"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Autore"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Anno di pubblicazione"
                    value={publicationYearFilter}
                    onChange={(e) => setPublicationYearFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Prezzo"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
            </div>
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="border-b bg-sky-200">
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Book</th>
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Author</th>
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Review</th>
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Publication Year</th>
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Price</th>
                        <th className="px-6 py-3 text-gray-600 font-semibold text-sm uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookData.map((book) => (
                        <Row
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            review={book.review || ''}
                            publication_year={book.publication_year}
                            price={book.price}
                            onEdit={openEditModal}
                        />
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center w-full mt-4">
                <button
                    onClick={prevPage}
                    className={`px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={page === 0}
                >
                    Pagina precedente
                </button>
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

            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddBook={handleAddBook}
            />

            {currentBook && (
                <EditBookModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdateBook={handleUpdateBook}
                    book={currentBook}
                />
            )}
        </div>
    );
};

export default Table;
