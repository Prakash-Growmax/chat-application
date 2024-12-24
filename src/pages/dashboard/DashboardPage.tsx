import { ChatWindow } from "@/components/dashboard/ChatWindow";
import { DataInsights } from "@/components/dashboard/DataInsights";
import { FileList } from "@/components/dashboard/FileList";
import { FileUploadZone } from "@/components/dashboard/FileUploadZone";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [insights, setInsights] = useState([
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 200 },
    { name: "Category D", value: 100 },
  ]);

  const handleFileUpload = (file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
    };
    setFiles((prev) => [...prev, newFile]);
    setSelectedFile(newFile);
  };

  const handleFileDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (message: string) => {
    // Implement your chat logic here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleExportInsights = () => {
    // Implement export logic
  };

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          You have used {user?.tokenUsage?.toLocaleString()} tokens this month
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <FileUploadZone onFileUpload={handleFileUpload} />
          <FileList
            files={files}
            onDelete={handleFileDelete}
            onSelect={handleFileSelect}
          />
          {selectedFile && (
            <DataInsights data={insights} onExport={handleExportInsights} />
          )}
        </div>
        <div className="space-y-6">
          <ChatWindow
            fileName={selectedFile?.name}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
