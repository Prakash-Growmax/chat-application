import { CSVPreviewData, FileMetadata } from "@/lib/types/csv";
import React, { useState } from "react";
import LucideIcon from "../Custom-UI/LucideIcon";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CSVPreviewData;
  metadata: FileMetadata;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  metadata,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Pagination calculations
  const totalPages = Math.ceil(data.rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.rows.length);
  const currentRows = data.rows.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle sm:max-w-7xl sm:w-full ring-1 ring-gray-900/5">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 h-[95vh]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3
                  className="text-xl leading-7 font-semibold text-gray-900 font-sans"
                  id="modal-title"
                >
                  {metadata.filename}
                </h3>
                <div className="max-h-[calc(100vh-200px)] overflow-auto">
                  <div className="text-sm text-gray-600 flex items-center gap-3 font-medium flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span className="font-normal text-gray-500">Size:</span>
                      {formatFileSize(metadata.size)}
                    </span>
                    {formatDate(metadata.lastModified)}
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="font-normal text-gray-500">Rows:</span>
                      {data?.totalRows?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close preview"
              >
                <LucideIcon name={"X"} className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 border rounded-lg overflow-hidden border-gray-200 h-[80%]">
              <div className="overflow-x-auto h-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {data.headers.map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-gray-50/80"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-normal"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="rounded-md border-gray-300 py-1.5 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} - {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{data.rows.length}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LucideIcon
                      name={"ChevronLeft"}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LucideIcon
                      name={"ChevronRight"}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
