import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import Papa from "papaparse";
import { CSVPreviewData, FileMetadata, PreviewError } from "./types/csv";
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: import.meta.env.VITE_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
export class S3UploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "S3UploadError";
  }
}

export async function uploadToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    const Key = `analytics/${file.name}`;
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key,
        Body: file,
        ContentType: file.type,
      },
    });
    // Add progress listener
    upload.on("httpUploadProgress", (progress) => {
      if (progress.loaded && progress.total) {
        const uploadProgress: UploadProgress = {
          loaded: progress.loaded,
          total: progress.total,
          percentage: Math.round((progress.loaded * 100) / progress.total),
        };
        onProgress?.(uploadProgress);
      }
    });
    //working....
    // const params = {
    //   Bucket: "growmax-dev-app-assets",
    //   Key: `analytics/${file.name}`,
    //   Body: file,
    //   ContentType: file.type,
    // };

    // const command = new PutObjectCommand(params);
    // const response = await s3Client.send(command);

    await upload.done();
    return Key;
  } catch (error) {
    console.error("S3 upload error:", error);
    if (error instanceof S3UploadError) {
      throw error;
    }
    throw new S3UploadError("Failed to upload file to S3");
  }
}
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const previewCache = new Map<
  string,
  { data: CSVPreviewData; timestamp: number }
>();

interface FileMetadata {
  filename: string;
  size: number;
  lastModified: Date;
}

interface CSVPreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

interface PreviewError {
  message: string;
  code: string;
}

const getFileMetadata = async (
  bucket: string,
  key: string
): Promise<FileMetadata> => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: `analytics/${key}`,
  });
  const response = await s3Client.send(command);

  return {
    filename: key.split("/").pop() || key,
    size: response.ContentLength || 0,
    lastModified: response.LastModified || new Date(),
  };
};

export const cleanKey = (inputKey: string): string => {
  // Remove s3:// prefix and bucket name if present
  let cleaned = inputKey.replace(/^s3:\/\/[^/]+\//, "");

  // Remove any leading/trailing slashes
  cleaned = cleaned.replace(/^\/+|\/+$/g, "");

  cleaned = cleaned.replace(/^analytics\/analytics\//, "analytics/");

  if (!cleaned.startsWith("analytics/")) {
    cleaned = `analytics/${cleaned}`;
  }

  return cleaned;
};

export const fetchCSVPreview = async (
  bucket: string,
  key: string,
  rowLimit?: number
): Promise<{ data: CSVPreviewData; metadata: FileMetadata }> => {
  const cleanedKey = cleanKey(key);

  const Keys = `analytics/${cleanedKey}`;

  const cacheKey = `${bucket}:${key}:${rowLimit || "all"}`;

  // Clear existing cache to ensure fresh data
  previewCache.delete(cacheKey);

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: Keys });
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No data received from S3");
    }

    const fileSize = response.ContentLength || 0;

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (fileSize > MAX_FILE_SIZE) {
      throw new Error("File too large for preview");
    }

    const csvString = await response.Body.transformToString();
    // Use worker: false to prevent web worker usage which might limit rows
    const parseResult = await new Promise<Papa.ParseResult<string[]>>(
      (resolve, reject) => {
        Papa.parse(csvString, {
          complete: (results: any) => {
            resolve(results);
          },
          error: (error: any) => {
            reject(new Error(`CSV parsing failed: ${error.message}`));
          },
          delimiter: ",", // Auto-detect delimiter
          skipEmptyLines: "greedy",
          worker: false,
          header: false,
          dynamicTyping: false,
          // Add error handling for malformed rows
          transform: (value: string) => {
            return value.trim();
          },
          transformHeader: (header: string) => {
            return header.trim();
          },
        });
      }
    );

    if (!parseResult.data || parseResult.data.length === 0) {
      throw new Error("CSV file is empty or contains no valid data");
    }

    const filteredData = parseResult.data.filter((row) => {
      return row.length > 0 && row.some((cell) => cell.trim() !== "");
    });

    if (filteredData.length < 2) {
      // At least headers and one data row
      throw new Error("CSV file contains no valid data rows");
    }

    const headers = filteredData[0];
    const allRows = filteredData.slice(1);

    // Apply row limit if specified
    const rows = rowLimit ? allRows.slice(0, rowLimit) : allRows;
    const previewData: CSVPreviewData = {
      headers,
      rows,
      totalRows: allRows.length,
    };

    // Cache the preview data
    previewCache.set(cacheKey, {
      data: previewData,
      timestamp: Date.now(),
    });

    const metadata: FileMetadata = {
      filename: cleanedKey.split("/").pop() || cleanedKey,
      size: fileSize,
      lastModified: response.LastModified || new Date(),
      contentType: response.ContentType || "text/csv",
      rowCount: allRows.length,
      columnCount: headers.length,
    };

    return { data: previewData, metadata };
  } catch (error) {
    console.error("Detailed error:", error);
    const previewError: PreviewError = {
      message: `Failed to fetch CSV preview: ${(error as Error).message}`,
      code: (error as any).code || "UNKNOWN_ERROR",
    };
    throw previewError;
  }
};

// const PREVIEW_ROWS = 20;
// // const TIMEOUT = 30000; // 30 seconds
// const previewCache = new Map<
//   string,
//   { data: CSVPreviewData; timestamp: number }
// >();
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// const getFileMetadata = async (
//   bucket: string,
//   key: string
// ): Promise<FileMetadata> => {
//   const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
//   const response = await s3Client.send(command);

//   return {
//     filename: key.split("/").pop() || key,
//     size: response.ContentLength || 0,
//     lastModified: response.LastModified || new Date(),
//   };
// };

// export const fetchCSVPreview = async (
//   bucket: string,
//   key: string
// ): Promise<{ data: CSVPreviewData; metadata: FileMetadata }> => {
//   const cacheKey = `${bucket}:${key}`;
//   const cached = previewCache.get(cacheKey);

//   if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
//     return { data: cached.data, metadata: await getFileMetadata(bucket, key) };
//   }

//   try {
//     const command = new GetObjectCommand({ Bucket: bucket, Key: key });
//     const response = await s3Client.send(command);

//     if (!response.Body) {
//       throw new Error("No data received from S3");
//     }

//     const csvString = await response.Body.transformToString();
//     const parseResult = await new Promise<Papa.ParseResult<string[]>>(
//       (resolve) => {
//         Papa.parse(csvString, {
//           preview: PREVIEW_ROWS,
//           complete: resolve,
//         });
//       }
//     );

//     const previewData: CSVPreviewData = {
//       headers: parseResult.data[0],
//       rows: parseResult.data.slice(1),
//       totalRows: parseResult.data.length - 1,
//     };

//     previewCache.set(cacheKey, {
//       data: previewData,
//       timestamp: Date.now(),
//     });

//     const metadata: FileMetadata = {
//       filename: key.split("/").pop() || key,
//       size: response.ContentLength || 0,
//       lastModified: response.LastModified || new Date(),
//     };

//     return { data: previewData, metadata };
//   } catch (error) {
//     const previewError: PreviewError = {
//       message: "Failed to fetch CSV preview",
//       code: (error as any).code,
//     };
//     throw previewError;
//   }
// };
