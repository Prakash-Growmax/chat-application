import { MessageObject } from "@/types";

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    type: 'text' | 'chart' | 'table';
    data?:MessageObject;
    error?: boolean;
  }
  
  export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    csvData: null;
    error: string | null;
    s3Key: string | null;
  }
  
  export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'area';
    data: ChartDataPoint[];
  }
  
  export interface ChartDataPoint {
    name: string;
    value: number;
  }
  
  export interface TableData {
    headers: string[];
    rows: string[];
  }
  
  export interface ChartProps {
    data: ChartDataPoint[];
  }