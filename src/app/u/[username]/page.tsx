"use client"
import {useParams} from "next/navigation";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {messageSchema} from "@/schemas/messageSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import toast, {Toaster} from "react-hot-toast";


const UserPage=()=>{

    const {username}=useParams()
    const {control,reset,handleSubmit,formState: { errors }} = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content:''
        }
    })
    const onSubmit =  async (data: z.infer<typeof messageSchema>) => {
        console.log("..data",data)
        console.log("i'm calling onsubmit")

        try {
            const response = await axios.post<ApiResponse>(`/api/send-message`, {
                content: data.content,
                username,
            })
            console.log("response",response)

            if (response.data.success) {
                toast.success(response.data.message)
                reset()
            }
            else if(!response.data.success) {
                toast.error(response.data.message)
            }

        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            console.error(err)

            toast.error(err.response.data.message)
        }

    }

    return<>
        <Paper sx={{mt:8,height:'100vh'}} >
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Typography variant="h4"  sx={{textAlign:'center'}}> Public Profile Link</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    gap: 2,
                    mx:'auto',
                    mt:6,
                }}
            >
                <Typography variant='body1' >
                    Send Anonymous Message to @{username || 'User'}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Controller
                        name='content'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                value={value}
                                onChange={onChange}
                                type='text'
                                label="Message"
                                 sx={{width:'100%'}}
                                error={!!errors.content}  // Display error if validation fails
                                helperText={errors.content?.message}
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{ mt: 3 }}
                        >
                            Send
                        </Button>
                    </Box>
                </form>
            </Box>
        </Paper>
    </>
}
export  default  UserPage