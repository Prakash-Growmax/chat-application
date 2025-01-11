import { ListItemText } from "@/Theme/Typography";
import { FileSliders } from "lucide-react";
export default function MyFiles() {
  return (
    <div
      className="flex items-center gap-3 rounded-lg hover:bg-gray-200 cursor-pointer px-4 py-2"
      style={{ marginTop: "4px" }}
    >
      <FileSliders size={12} color="#64748B" />
      <ListItemText> My File</ListItemText>
    </div>
  );
}
