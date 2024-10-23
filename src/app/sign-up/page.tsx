"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"
import {useDebounceValue} from 'usehooks-ts'
import {useEffect, useState} from "react";
import {singUpSchema} from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {useRouter} from "next/navigation";
import {Box, Button, Card, CardContent, CardHeader, Paper, TextField} from "@mui/material";
import toast from "react-hot-toast";
import Grid from '@mui/material/Grid2';


const SignInPage = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isUsernameChecking, setIsUsernameChecking] = useState(false)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const debouncedValue = useDebounceValue(username, 5000)

    const router = useRouter()
    const {control,watch,handleSubmit,formState: { errors }} = useForm<z.infer<typeof singUpSchema>>({
        resolver: zodResolver(singUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })



    // useEffect(() => {
    //     const checkUserName = async () => {
    //         if (debouncedValue) {
    //             setIsUsernameChecking(true)
    //             setUsernameMessage('')
    //             try {
    //                 const response = axios.get(`/api/check-unique-username?username=${debouncedValue}`)
    //                 setUsernameMessage(response.data.message)
    //             } catch (err) {
    //                 const axiosError = err as AxiosError<ApiResponse>
    //                 setUsernameMessage(axiosError?.response?.data?.message ??
    //                     'Error in checking username')
    //             } finally {
    //                 setIsUsernameChecking(false)
    //             }
    //         }
    //     }
    //     checkUserName()
    // }, [debouncedValue])


    const onSubmit =  (data: z.infer<typeof singUpSchema>) => {
        console.log("data",data)
        console.log("I'm Calling")
        // setIsFormSubmitting(true)
        // try {
        //     const response = await axios.post<ApiResponse>(`/api/signup`, data)
        //     if (response.data.success) {
        //         toast.success("Data Successfully added")
        //
        //     }
        //     router.push(`/verify/${username}`)
        //     setIsFormSubmitting(false)
        //
        // } catch (err) {
        //     const axiosError = err as AxiosError<ApiResponse>
        //     toast('Error in registering user')
        // }

    }
    return <>
        <Paper>
            <Box sx={{mt:5,height:'50vh'}}>
             <form onSubmit={handleSubmit(onSubmit)}>
                 <Grid container spacing={6}>
                     <Grid size={{ xs: 6, md: 8 }}>
                         <Controller
                             name='username'
                             control={control}
                             render={({ field:{onChange,value} }) => (
                                 <TextField
                                     value={value}
                                     onChange={onChange}
                                     type={'text'}
                                     fullWidth
                                     label="Username"
                                     error={!!errors.username}
                                     helperText={errors.username?.message}
                                 />
                             )}
                         />
                     </Grid>
                     <Grid size={{ xs: 6, md: 8 }}>
                         <Controller
                             name='email'
                             control={control}
                             render={({field: { onChange, value } }) => (
                                 <TextField
                                     value={value}
                                     onChange={onChange}
                                     fullWidth
                                     label="Email"
                                     error={!!errors.email}  // Display error if validation fails
                                     helperText={errors.email?.message}

                                 />

                             )}
                         />
                     </Grid>
                 </Grid>
                 <Button
                     type='submit'
                     variant='contained'
                     sx={{mt:5}}
                 >
                     Submit
                 </Button>
             </form>
            </Box>

        </Paper>
    </>
}

export default SignInPage