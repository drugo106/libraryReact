export interface Book {
    id: number;
    title: string;
    author: string;
    review?: string;
    publication_year: string;
    price: string;
  }


  export interface BookItem {
    title: string;
    author: string;
    publication_year: string;
    price: string;
  }