"use client"
import MessageCard from "@/components/MessageCard";
import {Box, Button, Divider, Paper, Switch, TextField, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {ApiResponse} from "@/types/ApiResponse";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import {User} from "next-auth";
import Grid from "@mui/material/Grid2";


const DashboardPage=()=>{

    const [message,setMessage]= useState([])
    const [isLoading,setIsLoading]= useState(false)
    const [acceptMessages, setAcceptMessages]= useState(false)


    const handleDeleteMessage=(messageId:string)=>{
        setMessage(message.filter((message)=>message._id!==messageId))
    }
    const {data:session}=useSession()
    const user:User= session?.user as User



    const fetchAcceptMessages=useCallback(async ()=>{
            try {
                 const response= await axios.get<ApiResponse>('api/accept-messages')
                  setAcceptMessages(response.data.isAcceptingMessage)
            }
            catch (err) {
                 toast.error('Failed fetch message settings')
            }
    },[acceptMessages])

    const fetchMessages= useCallback(async (refresh:boolean=false)=>{
       setIsLoading(true)
        try {
            const response= await axios.get<ApiResponse>('/api/get-messages')
            setMessage(response.data.messages || [])
            if(refresh)
            {
                toast.success('Showing latest messages')
            }
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
        finally {
            setIsLoading(false)
        }
    },[setIsLoading,setMessage])

    useEffect(()=>{
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessages()

    },[session,fetchMessages,fetchAcceptMessages])



    // if(!session || !session.user)
    // {
    //     return <div>Please Login </div>
    // }


    const username= user?.username
    const baseUrl=`${window.location.protocol}// ${window.location.host}`
    const profileUrl=`${baseUrl}/u/${username}`
    const copyToClipBoard=()=>{
        navigator.clipboard.writeText(profileUrl)
        toast.success('Profile URL copied to clipboard')
    }

  const handleAcceptMessage= async (e)=>{
        setAcceptMessages(e.target.checked)

      try {
            const response= await axios.post<ApiResponse>(`/api/accept-messages`, {acceptedMessage: !acceptMessages})
           setAcceptMessages(response.data.updatedUser.isAcceptingMessage)
            toast.success(response.data.message)


      }catch(e)
      {

      }
  }

   return<>
       <Paper  sx={{mt:3,p:4,height:'100vh'}}>
           <Toaster
               position="top-center"
               reverseOrder={false}
           />
           <Typography variant='h4'>User Dashboard</Typography>
           <Typography  variant ='h6' sx={{mt:2}}>Copy your unique link</Typography>
          <Box sx={{display: 'flex',mt:1}}>
              <TextField value={profileUrl} fullWidth/>
              <Button onClick={copyToClipBoard} variant='contained' sx={{ml:5}} size='small'>Copy </Button>
          </Box>

           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center',mt:3 }}>
               <Switch
                  size='2rem'
                   checked={acceptMessages}
                   onChange={(e)=>handleAcceptMessage(e)} // Directly update with field.onChange
               />
               <Typography variant='body'>Accept Messages</Typography>
               : <Typography variant='body'>{acceptMessages ? 'on' : 'off'}</Typography>

           </Box>
           <Divider sx={{mt:1}}/>
           <Grid container spacing={4} sx={{mt:3}}>
                   {
                       message.length> 0 ?(
                           message?.map((m)=>(

                               <Grid  size={{ xs: 12, md: 6}}>
                                   <MessageCard
                                       message={m}
                                       onMessageDelete={handleDeleteMessage}

                                   />
                               </Grid>

                           ))
                       ):(
                           <Typography variant='h6' sx={{display:'flex',justifyContent:'center',alignItem:'center',mt:6}}>No Message to display</Typography>
                       )
                   }
               </Grid>



       </Paper>
   </>
}
export  default  DashboardPage