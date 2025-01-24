import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LucideIcon from "../Custom-UI/LucideIcon";

interface DataInsightsProps {
  data: any[]; // Replace with your data type
  onExport: () => void;
}

export function DataInsights({ data, onExport }: DataInsightsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Data Insights</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <LucideIcon name={"Download"} className="h-4 w-4" mr-2 />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
