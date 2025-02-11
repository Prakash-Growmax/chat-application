import { UploadProgress } from "@/types/s3";
import { cleanKey } from "@/utils/s3.utils";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CSVPreviewData, FileMetadata, PreviewError } from "./types/csv";

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

export const previewCache = new Map<
  string,
  { data: CSVPreviewData; timestamp: number }
>();

const s3Client = new S3Client({
  region: import.meta.env.VITE_S3_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

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

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Create the PutObjectCommand
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
    });

    // Upload the file
    await s3Client.send(command);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Return a promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Setup progress handler
      xhr.upload.onprogress = (event) => {
        if (onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
        
          onProgress(progress);
        }
      };

      // Setup completion handler
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(Key);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      // Setup error handler
      xhr.onerror = () => {
        reject(new Error("Upload failed"));
      };

      // Start the upload
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });

    // Return the S3 object key
    return Key;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export const fetchCSVPreview = async (
  bucket: string,
  key: string,
  rowLimit?: number
): Promise<{ data: CSVPreviewData; metadata: FileMetadata }> => {
  const cleanedKey = cleanKey(key);

  const Keys = `${cleanedKey}`;
  
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

    const fileBuffer = await response.Body.transformToByteArray();
    const fileType = key.endsWith('.xlsx') ? 'xlsx' : 'csv';

    let parseResult: Papa.ParseResult<string[]> | XLSX.WorkBook;

    if (fileType === 'csv') {
      const csvString = new TextDecoder().decode(fileBuffer);
      parseResult = await new Promise<Papa.ParseResult<string[]>>(
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
    } else if (fileType === 'xlsx') {
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      parseResult = workbook;
    } else {
      throw new Error("Unsupported file type");
    }

    let headers: string[] = [];
    let rows: string[][] = [];

    if (fileType === 'csv') {
      const filteredData = (parseResult as Papa.ParseResult<string[]>).data.filter((row) => {
        return row.length > 0 && row.some((cell) => cell.trim() !== "");
      });

      if (filteredData.length < 2) {
        // At least headers and one data row
        throw new Error("CSV file contains no valid data rows");
      }

      headers = filteredData[0];
      const allRows = filteredData.slice(1);
      rows = rowLimit ? allRows.slice(0, rowLimit) : allRows;
    } else if (fileType === 'xlsx') {
      const sheetName = (parseResult as XLSX.WorkBook).SheetNames[0];
      const worksheet = (parseResult as XLSX.WorkBook).Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      if (jsonData.length < 2) {
        throw new Error("XLSX file contains no valid data rows");
      }

      headers = jsonData[0];
      const allRows = jsonData.slice(1);
      rows = rowLimit ? allRows.slice(0, rowLimit) : allRows;
    }

    const previewData: CSVPreviewData = {
      headers,
      rows,
      totalRows: rows.length,
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
      rowCount: rows.length,
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