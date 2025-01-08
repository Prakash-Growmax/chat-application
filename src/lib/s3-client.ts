

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
}const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);

  return {
    filename: key.split("/").pop() || key,
    size: response.ContentLength || 0,
    lastModified: response.LastModified || new Date(),
  };
};

export const fetchCSVPreview = async (
  bucket: string,
  key: string,
  rowLimit?: number
): Promise<{ data: CSVPreviewData; metadata: FileMetadata }> => {
  const cacheKey = `${bucket}:${key}:${rowLimit || 'all'}`;
  
  // Clear existing cache to ensure fresh data
  previewCache.delete(cacheKey);

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No data received from S3");
    }

    const csvString = await response.Body.transformToString();
    console.log('CSV string length:', csvString.length);
    console.log('First 100 characters:', csvString.substring(0, 100));

    // Use worker: false to prevent web worker usage which might limit rows
    const parseResult = await new Promise<Papa.ParseResult<string[]>>((resolve, reject) => {
      Papa.parse(csvString, {
        complete: (results) => {
          console.log('Total parsed rows:', results.data.length);
          resolve(results);
        },
        error: (error) => {
          console.error('Parse error:', error);
          reject(error);
        },
        delimiter: ",",
        skipEmptyLines: "greedy", // More aggressive empty line skipping
        worker: false, // Disable worker to prevent row limitations
        header: false, // Ensure we get raw rows
        dynamicTyping: false, // Keep everything as strings
      });
    });

    console.log('Parse complete. Data rows:', parseResult.data.length);

    // Filter out any empty rows
    const filteredData = parseResult.data.filter(row => 
      row.length > 0 && row.some(cell => cell !== '')
    );

    console.log('Filtered rows:', filteredData.length);

    const headers = filteredData[0];
    const allRows = filteredData.slice(1);
    
    console.log('Headers:', headers);
    console.log('Available rows:', allRows.length);

    // If rowLimit is specified and less than available rows, slice the array
    const rows = rowLimit && rowLimit < allRows.length ? allRows.slice(0, rowLimit) : allRows;

    console.log('Final rows being returned:', rows.length);

    const previewData: CSVPreviewData = {
      headers,
      rows,
      totalRows: allRows.length,
    };

    previewCache.set(cacheKey, {
      data: previewData,
      timestamp: Date.now(),
    });

    const metadata: FileMetadata = {
      filename: key.split("/").pop() || key,
      size: response.ContentLength || 0,
      lastModified: response.LastModified || new Date(),
    };

    return { data: previewData, metadata };
  } catch (error) {
    console.error('Detailed error:', error);
    const previewError: PreviewError = {
      message: `Failed to fetch CSV preview: ${(error as Error).message}`,
      code: (error as any).code || 'UNKNOWN_ERROR',
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
