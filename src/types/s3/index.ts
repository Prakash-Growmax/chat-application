export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileMetadata {
  filename: string;
  size: number;
  lastModified: Date;
}

export interface CSVPreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export interface PreviewError {
  message: string;
  code: string;
}
