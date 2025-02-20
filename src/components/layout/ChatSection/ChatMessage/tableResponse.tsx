import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
interface TableResponseProps {
  data: { x: (number | string)[]; y: (number | string)[] }[] | undefined;
}

export default function TableResponse({ data }: TableResponseProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [tableData, setTableData] = useState<{ x: number | string; y: number | string }[]>([]);

  // Prepare table data
  useEffect(() => {
    if (data) {
      const formatted = data[0].x.map((xValue, index) => ({
        x: xValue,
        y: data[0].y[index],
      }));
      setTableData(formatted);
    }
  }, [data]);

  // Calculate pagination
  const totalPages = Math.ceil(tableData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = tableData.slice(startIndex, endIndex);

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="w-full">
      <Table className="border border-black border-collapse">
        {/* <TableHeader>
          <TableRow>
            <TableCell className="border border-black font-bold">Header Y</TableCell>
            <TableCell className="border border-black font-bold">Header X</TableCell>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {currentData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="border border-black">{row.y}</TableCell>
              <TableCell className="border border-black">{row.x}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 flex items-center border-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={previousPage}
            disabled={currentPage === 1}
          >
              <ChevronFirst size={20} color="black" />
            <ChevronLeft size={20} color="black"/>
          
          </button>
          <button
            className="px-4 py-2 flex items-center border-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
              <ChevronRight size={20} color="black" />
              <ChevronLast size={20} color="black" />
          </button>
        </div>
        <div>
         <p className="text-sm font-semibold"> Page {currentPage} of {totalPages}</p>
        </div>
        <div className="flex items-center gap-2">
  <p className="text-sm">Rows per page:</p>
  <select
      className="border border-gray-300 rounded p-1 text-sm focus:outline-none"
    value={pageSize}
    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
  >
    {[5, 10, 20].map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>
</div>

      </div>
    </div>
  );
}