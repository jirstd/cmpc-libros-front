import { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchBooks, createBook, updateBook, deleteBook, fetchGenres, fetchPublishers } from "../store/librosSlice";
import TableComponent, { Column } from "../components/common/TableComponent";
import FormModalComponent, { FieldConfig } from "../components/common/FormModalComponent"; // 🔁 Nuevo componente dinámico
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Libros }  from "../types/Libros";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Books = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { list: books, genres, publishers, loading } = useSelector((state: RootState) => state.books);
  const { list: books, total, genres, publishers, loading } = useSelector((state: RootState) => state.books);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Libros | null>(null);
  const [sortBy, setSortBy] = useState<string>("titulo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(
        fetchBooks({
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          sortBy,
          sortDir: sortDirection,
        })
      );
    }, 400); // debounce en búsqueda
  
    return () => clearTimeout(debounce);
  }, [dispatch, page, rowsPerPage, searchTerm, sortBy, sortDirection]);
  
  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchPublishers());
  }, [dispatch]);

  const columns: Column<Libros>[] = [
    { key: "id", label: "ID" },
    {
      key: "imagen",
      label: "Portada",
      render: (_, row) =>
        row.imagen ? (
          <img
            src={`http://localhost:5173${row.imagen}`}
            alt="Portada"
            style={{ width: 60, borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
    { key: "titulo", label: "Nombre" },
    { key: "autor", label: "Autor" },
    { key: "genero_id", label: "Género", render: (_, row) => row.genero?.nombre },
    { key: "editorial_id", label: "Editorial", render: (_, row) => row.editorial?.nombre },
    { key: "precio", label: "Precio" },
    { key: "disponible", label: "Disponible", render: (_, row) => (row.disponible ? "✅" : "❌") },
  ];

  const availebleOptions = [
    { label: "Sí", value: "true" },
    { label: "No", value: "false" },
  ];

  // const formFields: FieldConfig[] = editingUser
  // ? [
  //   { name: "imagen", label: "Imagen", type: "file" },
  //   { name: "titulo", label: "Nombre", type: "text" },
  //   { name: "autor", label: "Autor", type: "text" },
  //   { name: "genero_id", label: "Género", type: "select", options: genres.map((g) => ({ label: g.nombre, value: g.id })) },
  //   { name: "editorial_id", label: "Editorial", type: "select", options: publishers.map((p) => ({ label: p.nombre, value: p.id })) },
  //   { name: "precio", label: "Precio", type: "number" },
  //   { name: "disponible", label: "Disponible", type: "select", options: availebleOptions },
  // ] : [
  //   { name: "imagen", label: "Imagen", type: "file" },
  //   { name: "titulo", label: "Nombre", type: "text" },
  //   { name: "autor", label: "Autor", type: "text" },
  //   { name: "genero_id", label: "Género", type: "select", options: genres.map((g) => ({ label: g.nombre, value: g.id })) },
  //   { name: "editorial_id", label: "Editorial", type: "select", options: publishers.map((p) => ({ label: p.nombre, value: p.id })) },
  //   { name: "precio", label: "Precio", type: "number" },
  //   { name: "disponible", label: "Disponible", type: "select", options: availebleOptions },
  // ];

  const formFields: FieldConfig[] = [
    { name: "imagen", label: "Imagen", type: "file" },
    { name: "titulo", label: "Nombre", type: "text" },
    { name: "autor", label: "Autor", type: "text" },
    {
      name: "genero_id",
      label: "Género",
      type: "select",
      options: genres.map((g) => ({ label: g.nombre, value: g.id })),
    },
    {
      name: "editorial_id",
      label: "Editorial",
      type: "select",
      options: publishers.map((p) => ({ label: p.nombre, value: p.id })),
    },
    { name: "precio", label: "Precio", type: "number" },
    { name: "disponible", label: "Disponible", type: "select", options: availebleOptions },
  ];
  
  const handleEdit = (book: Libros) => {
    setEditingUser(book);

    dispatch(
      fetchBooks({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sortBy,
        sortDir: sortDirection,
      })
    );

    setModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    await dispatch(deleteBook(id));

    dispatch(
      fetchBooks({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sortBy,
        sortDir: sortDirection,
      })
    );
    
  };

  const handleCreateOrUpdate = async (formData: Record<string, string | number | File>) => {
    let imagenPath = typeof formData.imagen === "string" ? formData.imagen : "";

    // Si es File, guardamos en /public/uploads/libros
    if (formData.imagen instanceof File) {
      const ext = formData.imagen.name.split(".").pop();
      const filename = `${uuidv4()}.${ext}`;
      imagenPath = `/uploads/libros/${filename}`;

      const reader = new FileReader();
      reader.onload = async () => {
        const blob = new Blob([reader.result as ArrayBuffer]);

        try {
          await axios.put(`http://localhost:4001/upload?filename=${filename}`, blob, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
          });
        } catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      };
      reader.readAsArrayBuffer(formData.imagen);
    }

    const payload = {
      titulo: String(formData.titulo),
      autor: String(formData.autor),
      genero_id: String(formData.genero_id),
      editorial_id: String(formData.editorial_id),
      precio: Number(formData.precio),
      disponible: String(formData.disponible) === "true",
      imagen: imagenPath,
    };

    if (editingUser) {
      await dispatch(updateBook({ id: editingUser.id, ...payload }));
    } else {
      await dispatch(createBook(payload));
    }

    dispatch(
      fetchBooks({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sortBy,
        sortDir: sortDirection,
      })
    );

    setEditingUser(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (newSize: number) => {
    if (rowsPerPage !== newSize) {
      setRowsPerPage(newSize);
      setPage(newSize); // ✅ solo si realmente cambió el tamaño
    }
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(0); // volver a primera página al cambiar orden
  };
  

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingUser(null);
          setModalOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Agregar Usuario
      </Button>

      <TableComponent<Libros>
        columns={columns}
        data={books}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(term) => {
          setSearchTerm(term);
          // setPage(0); // ✅ esto sí lo dejamos al buscar
        }}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        pagination={{
          total,
          page,
          rowsPerPage,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
      />

      <FormModalComponent
        open={modalOpen}
        title={editingUser ? "Editar Usuario" : "Agregar Usuario"}
        fields={formFields}
        defaultValues={(editingUser || {}) as Record<string, string | number>}  // ✅ FIX AQUÍ
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </Container>
  );
};

export default Books;
