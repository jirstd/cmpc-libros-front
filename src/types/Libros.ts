export interface Relacion {
    id: string;
    nombre: string;
  }
  
  export interface Libros {
    id: string;
    titulo: string;
    autor: string;
    editorial_id: string;
    genero_id: string;
    precio: number;
    disponible: boolean;
    imagen: string;
    genero?: Relacion;
    editorial?: Relacion;
  }
  
  export interface GenresAndPublishers {
    id: string;
    nombre: string;
  }