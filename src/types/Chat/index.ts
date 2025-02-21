export interface ChatSession {
  id: string;
  // Add other session properties
}
export interface RenameSession{
  id:string;
  name:string;
  org_id:string;
  status:string;
  chat_metadata:{
    archived_at:string,
    archive_reason:string,
    previous_status:string,
    redis_session_status:string,
  },
  is_updated:number,
  created_at:string,
  updated_at:string,
  uuid_changed:false,
  original_uuid:number | string,
}

export interface CreateSessionRequest {
  name: string;
  chat_metadata?: any;
}
export interface renameSessionRequest {
  new_name: string;
 
}
export interface ChatHistory {
  data: {
    items: Array<any>;
  };
}
export interface uploadDataSetRequest {
  s3_path: string;
  org_id: string;
  type: string;
}
export interface analyseDataset {
  query: string;
  user_id: string;
  org_id: string;
}

export interface AnalyzeChatRequest {
  query: string;
  org_id: string;
  user_id: string;
  chat_id: string;
}

//Api Response Types.....

export interface CreateChatResponse {
  id: string;
  uuid_changed: boolean;
  name: string;
  org_id: string;
  status: string;

  // Add other session properties
}
export interface LayoutResponse{
  annotations:any;
  bargap:number;
  bargroupgap:number;
  height:number;
  hovermode:string;
  margin:any;
  paper_bgcolor:string;
  plot_bgcolor:string;
  showlegend:boolean;
  subtitle:string;
  title:any;
  uniformtext:any;
  width:number;
  xaxis:any;
  yaxis:any;


}

export interface UploadDatasetResponse {
  error?: string;
  response?: string;
  id: string;
  status: string | "failed";
  token_usage: any;
}
export interface AnalyzeChatResponse {
  error?: string;
  response?: string;
  id: string;
  status: string | "failed";
  token_usage: any;
}
