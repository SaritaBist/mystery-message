"use client"
import {Box, Button, Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useState} from "react";
import DialogDelete from "@/components/DialogDelete";
import {Message} from "@/model/User";
import {ApiResponse} from "@/types/ApiResponse";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import dayjs from "dayjs";

type MessageCardContent={
  message:Message;
  onMessageDelete:(messageId:string)=>void;
}
const MessageCard=({message,onMessageDelete}:MessageCardContent)=>{
    const [openDeleteDialog,setOpenDeleteDialog]=useState(false)
    const handleDeleteClick=(show)=>{
        setOpenDeleteDialog(show)
    }

  const handleDelete= async ()=>{
        const response = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`)

      if(response.data.success)
      {
          toast.success(response.data.message)
      }
      else {
          toast.error(response.data.message)
      }
      onMessageDelete(message._id)
  }

    return<>
        <Card>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <DialogDelete
                show={openDeleteDialog}
                handleDialog={handleDeleteClick}
                handleDelete={handleDelete}
            />
            <CardHeader></CardHeader>
            <CardContent>
               <Box sx={{display:'flex', justifyContent:'space-between'}}>
                   <Box>
                       <Typography>{message?.content}</Typography>
                       <Typography>{dayjs(message?.createdAt).format('YYYY-MMM-DD  hh:mm')}</Typography>
                   </Box>
                  <Button variant='contained' onClick={()=>handleDeleteClick(true)} sx={{backgroundColor:'red'}}> <CloseIcon ></CloseIcon></Button>
               </Box>
            </CardContent>
        </Card>
    </>
}
export  default MessageCard