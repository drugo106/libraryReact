import React from 'react';
import {Book} from '../interfaces/Interfaces.ts'

interface Props {
  id: number; // Aggiungi l'ID del libro
  title: string;
  author: string;
  review?: string;
  publication_year: string;
  price: string;
  onEdit: (book: Book) => void;
}

const Row: React.FC<Props> = ({ id, title, author, review, publication_year, price, onEdit }) => {
  return (
    <tr className="border-b">
      <td className="px-6 py-3">{title}</td>
      <td className="px-6 py-3">{author}</td>
      <td className="px-6 py-3">{review}</td>
      <td className="px-6 py-3">{publication_year}</td>
      <td className="px-6 py-3">{price}</td>
      <td className="px-6 py-3">
        <button
          onClick={() => onEdit({ id, title, author, review: review || '', publication_year, price })}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Modifica
        </button>
      </td>
    </tr>
  );
};

export default Row;
