import { useEffect, useState } from "react";
import { useProfile } from "./profile/useProfile";
import { useAuth } from "./useAuth";

export function useCreateChatId(state) {
    const {user}=useAuth();
    const { profile } = useProfile();
    const token = localStorage.getItem("supabase.auth.token");
    const tokenJson = JSON.parse(token);
    const accessToken=tokenJson.access_token;
    const tokenType = tokenJson.token_type;
    const chatId=localStorage.getItem("chatId");
    const [res,setRes]=useState([]);
    const message=state.messages;
    async function getChatId() {
        if (profile?.organization_id) {
            const requestBody = {
                name: "New Thread",
                chat_metadata: {
                    message: "Trying the chat API..."
                }
            };
    
            const response = await fetch("https://analytics-production-88e7.up.railway.app/api/v1/chat/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Add this
                    "x-organization-id": profile.organization_id,
                    "Authorization": `${tokenType} ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });
    
            // Handle the response
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                throw new Error(`API request failed: ${response.status}`);
            }
    
            const data = await response.json();
            setRes(data)
            localStorage.setItem("chatId",data.id)
        } else {
            console.error("Organization ID is missing.");
            throw new Error("Organization ID is required");
        }
    }
    useEffect(() => {
        if (user && profile?.organization_id && accessToken && message.length === 0 && !chatId) {
            getChatId();
        }
    }, [user, profile?.organization_id, accessToken,message,chatId]);
   
  
    return {
        chatId:res.id
      
    };
}
