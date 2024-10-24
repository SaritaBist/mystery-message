"use client"
import {useParams, useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {verifyShcema} from "@/schemas/verifySchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import toast, {Toaster} from "react-hot-toast";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";


const verifyAccountPage=()=>{

    const router = useRouter()
    const params= useParams()
    console.log("params",params)

    const {control,reset,handleSubmit,formState: { errors }} = useForm<z.infer<typeof verifyShcema>>({
        resolver: zodResolver(verifyShcema),

    })

    const onSubmit =  async (data: z.infer<typeof verifyShcema>) => {
        console.log("data",data)
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            })
            if (response.data.success) {
                toast.success(response.data.message)
                // reset()
            }
            router.replace('/sign-in')

        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast.error('Error in verify code')
        }

    }

    return<>
        <Paper elevation={7} sx={{width:'30%',m:'auto',mt:5}}>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Box sx={{

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h2>Verify Your Account</h2>
                <Typography variant='body' sx={{mb:5}}>Enter the verification code sent to your email</Typography>
                <form onSubmit={handleSubmit(onSubmit)} style={{}} >
                    <Grid container spacing={2} >
                        <Grid size={{ xs: 6, md: 12}}>
                            <Controller
                                name='code'
                                control={control}
                                render={({ field:{onChange,value} }) => (
                                    <TextField
                                        value= {value}
                                        onChange={onChange}
                                        size='small'
                                        type={'text'}
                                        fullWidth
                                        label="Verification Code"
                                        error={!!errors.code}
                                        helperText={errors.code?.message}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                    <Box sx={{display:'flex',justifyContent:'start'}}>
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{my:5}}
                        >
                            Verify
                        </Button>

                    </Box>

                </form>
            </Box>

        </Paper>

    </>
}
export default  verifyAccountPage