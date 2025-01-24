import { Tooltip } from "@mui/material";
import React from "react";
import LucideIcon from "../Custom-UI/LucideIcon";
interface PreviewButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}
export const PreviewButton: React.FC<PreviewButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <>
      <Tooltip title="Preview Csv">
        <button
          onClick={onClick}
          disabled={disabled || isLoading}
          className="inline-flex items-center px-2 py-2 text-sm items-center justify-center bg-transparent text-black font-medium hover:bg-gray-100 rounded hover:outline-none hover:border-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none "
          aria-label="Preview CSV file"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 text-black">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <LucideIcon
              name={"Eye"}
              className="h-6 w-6 text-black"
              aria-hidden="true"
            />
          )}
        </button>
      </Tooltip>
    </>
  );
};
