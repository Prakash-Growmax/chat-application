import { chatService } from "@/services/ChatService";
import { useProfile } from "./profile/useProfile";
import { ApiError } from "@/services/apiConfig";
import { useEffect, useState } from "react";
import { token } from "@/utils/storage.utils";


export function useChatList(setSessionList){
  const {profile}=useProfile();
  // const [sessionList,setSessionList]=useState([])
  async function getSessionList(){  
    if (profile?.organization_id) {
  try {
      const response = await chatService.getSession({
        headers: {
          "Content-Type":"application/json",
          "x-organization-id": profile.organization_id,
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response?.status !== 200)
        throw new Error("Error while creating session");

       setSessionList(response);
       return response;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`API Error: ${error.status} - ${error.statusText}`);
      }
    }
  } else {
    console.error("Organization ID is missing.");
    throw new Error("Organization ID is required");
  }}
 
  useEffect(()=>{
   if(profile?.organization_id&&token){
     getSessionList();
   }
  },[profile?.organization_id,token])
      return {
      //  getSessionList,
      //  sessionList
      };
    }

   
