import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, IconButton, CircularProgress, TextField, TablePagination, Box
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import SortableTableHeader from "./SortableTableHeader";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string | number) => void;
  loading?: boolean;
  onSearch?: (term: string) => void;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string) => void;
  pagination?: {
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
  rowsPerPageOptions?: number[]; // ✅ NUEVO
}

const TableComponent = <T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
  onSearch,
  sortBy,
  sortDirection,
  onSortChange,
  pagination,
  rowsPerPageOptions
}: Props<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (onSearch) onSearch(searchTerm);
  }, [searchTerm, onSearch]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // const paginatedData = pagination
  // ? data.slice(
  //     pagination.page * pagination.rowsPerPage,
  //     pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  //   )
  // : data;

  const paginatedData = data;

  // console.log("📄 Página actual:", pagination?.page);
  // console.log('columns -->', columns);
  
  return (
    <Box>
      {onSearch && (
        <TextField
          fullWidth
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
          margin="normal"
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* {columns.map((col) => (
                <TableCell key={String(col.key)}>{col.label}</TableCell>
              ))} */}
              {columns.map((col) => (
                <SortableTableHeader
                  key={String(col.key)}
                  label={col.label}
                  columnKey={String(col.key)}
                  active={sortBy === col.key}
                  direction={sortDirection || "asc"}
                  onSort={onSortChange || (() => {})}
                />
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No hay datos disponibles.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => onEdit(row)} size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(row.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          // onPageChange={(_, newPage) => pagination.onPageChange(newPage)}
          onPageChange={(event, newPage) => {
            event?.preventDefault(); // ✅ importante para asegurar flujo
            if (pagination?.onPageChange) {
              pagination.onPageChange(newPage);
            }
          }}
          rowsPerPage={pagination.rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25, 50]} // ✅ DEFAULT o personalizado
          onRowsPerPageChange={(e) =>
            pagination.onRowsPerPageChange(parseInt(e.target.value, 10))
          }
        />
      )}

    </Box>
  );
};

export default TableComponent;
