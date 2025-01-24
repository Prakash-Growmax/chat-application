import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import LucideIcon from "../Custom-UI/LucideIcon";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

interface FileListProps {
  files: UploadedFile[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function FileList({ files, onDelete, onSelect }: FileListProps) {
  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success("File deleted successfully");
  };

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <LucideIcon
                  name={"FileText"}
                  className="h-4 w-4 text-muted-foreground"
                />
                <span className="font-medium">{file.name}</span>
              </div>
            </TableCell>
            <TableCell>{formatFileSize(file.size)}</TableCell>
            <TableCell>{format(file.uploadedAt, "PPp")}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelect(file.id)}
                >
                  <LucideIcon name={"FileText"} className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(file.id)}
                >
                  <LucideIcon name={"Trash2"} className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {files.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground"
            >
              No files uploaded yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
