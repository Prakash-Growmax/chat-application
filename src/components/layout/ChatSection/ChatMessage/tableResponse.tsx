import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

export default function TableResponse({ tableDatas }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [tableData, setTableData] = useState([]);

  // Update table data when tableDatas changes
  useEffect(() => {
    if (tableDatas?.rows) {
      setTableData(tableDatas.rows);
    }
  }, [tableDatas]);

  // Calculate pagination
  const totalPages = Math.ceil(tableData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = tableData.slice(startIndex, endIndex);

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

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="w-full">
      {/* Responsive table wrapper with horizontal scroll */}
      <div className="overflow-x-auto border border-black rounded">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {tableDatas.headers.map((header, index) => (
                <TableCell 
                  key={index} 
                  className="border-b border-r border-black font-bold whitespace-nowrap px-4 py-2"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableDatas.headers.map((header, colIndex) => (
                  <TableCell 
                    key={colIndex} 
                    className="border-b border-r border-black px-4 py-2"
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - Made more responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center">
          <button
            className="px-2 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={previousPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronFirst className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="px-2 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
            <ChevronLast className="w-4 h-4" />
          </button>
        </div>
        
        <div>
          <p className="text-sm font-semibold">
            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
          </p>
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