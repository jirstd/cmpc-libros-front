import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Libros, GenresAndPublishers }  from "../types/Libros";

interface LibrosState {
  rows: Libros[];
  list: Libros[];
  count: number;
  total: number;
  genres: GenresAndPublishers[];
  publishers: GenresAndPublishers[];
  loading: boolean;
  error: string | null;
}

const initialState: LibrosState = {
  rows: [],
  list: [],
  count: 0,
  total: 0,
  genres: [],
  publishers: [],
  loading: false,
  error: null,
};

// Obtener libros con paginación y búsqueda
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "titulo",
    sortDir = "asc"
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) => {
    const response = await api.get("/books", {
      params: {
        page,
        limit,
        search,
        sort_by: sortBy,
        sort_dir: sortDir,
      },
    });
    return response.data.data; // ← contiene { rows, count }
  }
);

// Crear usuario con `roleId: null`
export const createBook = createAsyncThunk("books/createBook", async (book: { titulo: string; autor: string; genero_id: string; editorial_id: string; precio: number; disponible: boolean, imagen: string }) => {
  const response = await api.post("/books", book);
  return response.data;
});

// export const createBook = createAsyncThunk("books/createBook", async (book: FormData) => {
//   const response = await api.post("/books", book, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// });

// Actualizar usuario
export const updateBook = createAsyncThunk("books/updateBook", async (book: Libros) => {
  const data = {
    titulo: book.titulo,
    autor: book.autor,
    genero_id: book.genero_id,
    editorial_id: book.editorial_id,
    precio: book.precio,
    disponible: book.disponible,
    imagen: book.imagen,
  }
  const response = await api.put(`/books/${book.id}`, data);
  return response.data;
});

// export const updateBook = createAsyncThunk("books/updateBook", async (book: FormData & { id: string }) => {
//   const response = await api.put(`/books/${book.get("id")}`, book, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// });

// Eliminar usuario con confirmación
export const deleteBook = createAsyncThunk("books/deleteBook", async (id: string | number) => {
  await api.delete(`/books/${id}`);
  return id;
});

export const fetchGenres = createAsyncThunk("books/fetchGenres", async () => {
  const response = await api.get("/genres");
  return response.data.data
});

export const fetchPublishers = createAsyncThunk("books/fetchPublishers", async () => {
  const response = await api.get("/publishers");
  return response.data.data
});

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<{ rows: Libros[]; count: number }>) => {
        state.loading = false;
        state.list = action.payload.rows;
        state.total = action.payload.count;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error obteniendo libros";
      })
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<GenresAndPublishers[]>) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error obteniendo libros";
      })
      .addCase(fetchPublishers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublishers.fulfilled, (state, action: PayloadAction<GenresAndPublishers[]>) => {
        state.loading = false;
        state.publishers = action.payload;
      })
      .addCase(fetchPublishers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error obteniendo libros";
      })
      .addCase(createBook.fulfilled, () => {
        toast.success("Libro agregado exitosamente");
      })
      .addCase(createBook.rejected, (_state, action) => {
        toast.error(`Error al agregar libro: ${action.error.message}`);
      })
      .addCase(updateBook.fulfilled, () => {
        toast.success("Libro actualizado exitosamente");
      })
      .addCase(updateBook.rejected, (_state, action) => {
        toast.error(`Error al actualizar libro: ${action.error.message}`);
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.list = state.list.filter((book) => book.id !== action.payload);
        toast.success("Libro eliminado correctamente");
      })
      .addCase(deleteBook.rejected, (_state, action) => {
        toast.error(`Error al eliminar libro: ${action.error.message}`);
      });
  },
});

export default bookSlice.reducer;
