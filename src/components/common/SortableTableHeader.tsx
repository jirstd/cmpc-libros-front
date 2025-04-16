import React from "react";
import { TableCell, TableSortLabel } from "@mui/material";

interface Props {
  label: string;
  columnKey: string;
  active: boolean;
  direction: "asc" | "desc";
  onSort: (column: string) => void;
}

const SortableTableHeader = ({ label, columnKey, active, direction, onSort }: Props) => {
  const handleClick = () => {
    onSort(columnKey);
  };

  return (
    <TableCell sortDirection={active ? direction : false}>
      <TableSortLabel
        active={active}
        direction={direction}
        onClick={handleClick}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default SortableTableHeader;
