"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"
import {useDebounceCallback} from 'usehooks-ts'
import {useEffect, useState} from "react";
import {singUpSchema} from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {useRouter} from "next/navigation";
import {Box, Button, Card, CardContent, CardHeader, Checkbox, Paper, TextField, Typography} from "@mui/material";
import toast, {Toaster} from "react-hot-toast";
import Grid from '@mui/material/Grid2';
import Link from "next/link";


const SignInPage = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isUsernameChecking, setIsUsernameChecking] = useState(false)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()
    const {control,reset,handleSubmit,formState: { errors }} = useForm<z.infer<typeof singUpSchema>>({
        resolver: zodResolver(singUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })



    useEffect(() => {
        const checkUserName = async () => {
            if (username) {
                setIsUsernameChecking(true)

                try {
                    const response =  await axios.get(`/api/check-unique-username?username=${username}`)
                    if(response.data.success)
                   {
                       setUsernameMessage(response?.data?.message)
                   }
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError?.response?.data?.message ??
                        'Error in checking username')
                } finally {
                    setIsUsernameChecking(false)
                }
            }
        }
        checkUserName()
    }, [username])


    const onSubmit =  async (data: z.infer<typeof singUpSchema>) => {
        console.log("data",data)
        setIsFormSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/signup`, data)
            if (response.data.success) {
                toast.success(response.data.message)
                reset()
            }
            router.push(`/verify/${username}`)
            setIsFormSubmitting(false)

        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast.error('Error in registering user')
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
                <Typography variant='body' sx={{mb:5}}>Sign up to start your anonymous adventure</Typography>
             <form onSubmit={handleSubmit(onSubmit)} style={{marginLeft:20}} >
                 <Grid container spacing={2} >
                     <Grid size={{ xs: 6, md: 10}}>
                         <Controller
                             name='username'
                             control={control}
                             render={({ field:{onChange,value} }) => (
                                 <TextField
                                     value={username}
                                     onChange={(e)=>{
                                         onChange(e.target.value)
                                         debounced(e.target.value)
                                     }}
                                     size='small'
                                     type={'text'}
                                     fullWidth
                                     label="Username"
                                     error={!!errors.username}
                                     helperText={errors.username?.message}
                                 />
                             )}
                         />
                         <Typography sx={{color:usernameMessage==='Username is unique' ? 'green' : 'red'}}>{usernameMessage}</Typography>
                     </Grid>
                     <Grid size={{ xs: 6, md: 10}}>
                         <Controller
                             name='email'
                             control={control}
                             render={({field: { onChange, value } }) => (
                                 <TextField
                                     value={value}
                                     onChange={onChange}
                                     size='small'
                                     type='text'
                                     label="Email"
                                     fullWidth
                                     error={!!errors.email}  // Display error if validation fails
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
                         SignUp
                     </Button>

                 </Box>
                 <Box sx={{my:5}}>
                     <Typography>Already a member? <Link href={'/sign-in'} style={{textDecoration:'none'}}>sign in</Link></Typography>
                 </Box>
             </form>
            </Box>

        </Paper>
    </>
}

export default SignInPage