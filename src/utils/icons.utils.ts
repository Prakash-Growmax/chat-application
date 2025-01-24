import { LucideIcon } from "lucide-react"; // Import the type for Lucide icons

export const loadIcon = async (
  iconName: keyof typeof import("lucide-react")
): Promise<LucideIcon> => {
  const module = await import("lucide-react");
  return module[iconName] as LucideIcon; // Ensure the return type is LucideIcon
};
