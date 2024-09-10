import React from 'react';
import '../styles/Row.css'; 


interface Props {
  title: string;
  author: string;
  review: string;
  publication_year: string;
  price: string;
}

const Row: React.FC<Props> = (props: Props) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4 text-gray-800">{props.title}</td>
      <td className="px-6 py-4 text-gray-800">{props.author}</td>
      <td className="px-6 py-4 text-gray-800 review-cell">{props.review}</td>
      <td className="px-6 py-4 text-gray-800">{props.publication_year}</td>
      <td className="px-6 py-4 text-gray-800">{props.price}</td>
    </tr>
  );
};

export default Row;
