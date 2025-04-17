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
    setModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    await dispatch(deleteBook(id));
  };

  // const handleCreateOrUpdate = async (formData: Partial<Libros>) => {
  //   const data = new FormData();
  
  //   for (const [key, value] of Object.entries(formData)) {
  //     if (value instanceof File) {
  //       console.log('value -->',value);
  //       data.append(key, value);
  //     } else if (typeof value === 'boolean') {
  //       data.append(key, value ? 'true' : 'false');
  //     } else if (typeof value === 'number') {
  //       data.append(key, value.toString());
  //     } else {
  //       data.append(key, String(value));
  //     }
  //   }
  //   console.log('data -->',data);
  //   if (editingUser) {
  //     data.append("id", editingUser.id); // necesario para updateBook
  //     await dispatch(updateBook(data as FormData & { id: string }));
  //   } else {
  //     await dispatch(createBook(data));
  //   }
  
  //   dispatch(
  //     fetchBooks({
  //       page: page + 1,
  //       limit: rowsPerPage,
  //       search: searchTerm,
  //       sortBy,
  //       sortDir: sortDirection,
  //     })
  //   );
  //   setEditingUser(null);
  // };
  

  // const handleCreateOrUpdate = async (formData: Partial<Libros>) => {
  //   if (editingUser) {
  //     await dispatch(updateBook({
  //       id: editingUser.id,
  //       titulo: formData.titulo!,
  //       autor: formData.autor!,
  //       genero_id: formData.genero_id!,
  //       editorial_id: formData.editorial_id!,
  //       precio: Number(formData.precio!),
  //       disponible: formData.disponible! === true ? true : false,
  //       imagen: formData.imagen!, // opcional, si querés permitir editar imagen
  //     }));
  //   } else {
  //     const data = new FormData();
  
  //     for (const [key, value] of Object.entries(formData)) {
  //       if (value instanceof File) {
  //         data.append(key, value);
  //       } else {
  //         data.append(key, String(value));
  //       }
  //     }
  
  //     await dispatch(createBook(data));
  //   }
  
  //   dispatch(
  //     fetchBooks({
  //       page: page + 1,
  //       limit: rowsPerPage,
  //       search: searchTerm,
  //       sortBy,
  //       sortDir: sortDirection,
  //     })
  //   );
  //   setEditingUser(null);
  // };
  
  const handleCreateOrUpdate = async (formData: Partial<Libros>) => {
    let imagen = formData.imagen as string;

    if (formData.imagen && typeof formData.imagen === "object" && "name" in formData.imagen) {
      const ext = (formData.imagen as File).name.split('.').pop();
      const newName = `${uuidv4()}.${ext}`;
      const newPath = `/uploads/libros/${newName}`;
    
      // Copia en public (solo para desarrollo o previsualización rápida)
      const reader = new FileReader();
      reader.onload = () => {
        const a = document.createElement("a");
        a.href = reader.result as string;
        a.download = newName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      reader.readAsDataURL(formData.imagen as File);
    
      imagen = newPath;
    }

    const payload = {
      titulo: formData.titulo!,
      autor: formData.autor!,
      genero_id: formData.genero_id!,
      editorial_id: formData.editorial_id!,
      precio: Number(formData.precio!),
      disponible:  formData.disponible! === true ? true : false,
      imagen,
    };

    if (editingUser) {
      await dispatch(updateBook({...payload, id: editingUser.id }));
    } else {
      await dispatch(createBook(payload));
    }
    // 🔁 Volver a cargar data con filtros actuales
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
