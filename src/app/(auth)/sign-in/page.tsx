"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"
import {useEffect, useState} from "react";
import {singUpSchema} from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {useRouter} from "next/navigation";
import {Box, Button, Card, CardContent, CardHeader, Checkbox, Paper, TextField, Typography} from "@mui/material";
import toast, {Toaster} from "react-hot-toast";
import Grid from '@mui/material/Grid2';
import Link from "next/link";
import {signInSchema} from "@/schemas/signInSchema";
import {signIn} from "next-auth/react";


const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()
    const {control,reset,handleSubmit,formState: { errors }} = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })






    const onSubmit =  async (data: z.infer<typeof singUpSchema>) => {
        console.log("data",data)
     const response= await signIn('credentials',{
         redirect:false,
          email:data.email,
          password:data.password,
        })

        console.log("response",response)

        if(response?.error)
        {
            toast.error(response?.error)
        }
        if(response?.url)
        {
            toast.success("Login Successfully")
            router.replace('/dashboard')
        }


    }
    const handlePasswordClick=()=>{
        setShowPassword(!showPassword)
    }
    return <>
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
                <h2>Join Mystery Message</h2>
                <Typography variant='body' sx={{mb:5}}>Sign in to start your anonymous adventure</Typography>
                <form onSubmit={handleSubmit(onSubmit)} style={{marginLeft:20}} >
                    <Grid container spacing={2} >
                        <Grid size={{ xs: 6, md: 10}}>
                            <Controller
                                name='email'
                                control={control}
                                render={({ field:{onChange,value} }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        size='small'
                                        type={'text'}
                                        fullWidth
                                        label="Email/Username"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />

                        </Grid>

                        <Grid size={{ xs: 6, md: 10}}>
                            <Controller
                                name='password'
                                control={control}
                                render={({field: { onChange, value } }) => (
                                    <TextField
                                        value={value}
                                        onChange={onChange}
                                        fullWidth
                                        type={ showPassword ? 'text' :'password'}
                                        size='small'
                                        label="Password"
                                        error={!!errors.password}  // Display error if validation fails
                                        helperText={errors.password?.message}

                                    />

                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 10}} sx={{display: 'flex',alignItems:'center'}}>
                            <Checkbox  value={showPassword}  onClick={handlePasswordClick}  />
                            <Typography>Show Password</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{display:'flex',justifyContent:'start'}}>
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{mt:5}}
                        >
                            SignIn
                        </Button>

                    </Box>
                    <Box sx={{my:5}}>
                        <Typography>Don't have an account ? <Link href={'/sign-up'} style={{textDecoration:'none'}}>sign up</Link></Typography>
                    </Box>
                </form>
            </Box>

        </Paper>
    </>
}

export default SignUpPage