
import { useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import { useGetChatHistory } from "@/hooks/useGetChatHistory";

const RecentChat=()=>{
    const { id } = useParams();
 const {data}=useGetChatHistory(id);


 return(
    <Chat message={data}/>
 )

}
export default RecentChat