"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {useDebounceValue} from 'usehooks-ts'
import {useEffect, useState} from "react";
import {singUpSchema} from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {useRouter} from "next/navigation";

const SignInPage = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isUsernameChecking, setIsUsernameChecking] = useState(false)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const debouncedValue = useDebounceValue(username, 5000)

    const router = useRouter()
    const form = useForm<z.infer<typeof singUpSchema>>({
        resolver: zodResolver(singUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUserName = async () => {
            if (debouncedValue) {
                setIsUsernameChecking(true)
                setUsernameMessage('')
                try {
                    const response = axios.get(`/api/check-unique-username?username=${debouncedValue}`)
                    setUsernameMessage(response.data.message)
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
    }, [debouncedValue])


    const onSubmit = async (data: z.infer<typeof singUpSchema>) => {
        console.log(data)
        setIsFormSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/signup`, data)
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message
                })

            }
            router.push(`/verify/${username}`)
            setIsFormSubmitting(false)

        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            toast({
                title: 'Signup Failed',
                description: axiosError?.response?.data?.message ??
                    'Error in registering user'
            })
        }

    }
    return <>
        {/*<div className = " flex justify-center items-center min-h-screen bg-gray-100 ">*/}
        {/*    <div className = " w-full max-w-md p-8 bg-white rounded-lg shadow-md">*/}
        {/*        <div className=" text-center">*/}
        {/*            <h2 className="text-4xl font-bold tracking-tight mb-6">Join in mystery messages</h2>*/}
        {/*             <p className="mb-4">Sign up to start you anonymous adventures</p>*/}
        {/*        </div>*/}
        {/*        <Form {...form}>*/}
        {/*            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">*/}
        {/*                <FormField*/}
        {/*                    name="username"*/}
        {/*                    control={form.control}*/}
        {/*                    render={({ field }) => (*/}
        {/*                        <FormItem>*/}
        {/*                            <FormLabel>Username</FormLabel>*/}
        {/*                            <FormControl>*/}
        {/*                                <Input placeholder="" {...field}*/}
        {/*                                       onChange={(e)=>{*/}
        {/*                                           field.onChange(e);*/}
        {/*                                           setUsername(e.target.value);*/}
        {/*                                       }}*/}
        {/*                                />*/}
        {/*                            </FormControl>*/}

        {/*                            <FormMessage />*/}
        {/*                        </FormItem>*/}
        {/*                    )}*/}
        {/*                />*/}

        {/*                <FormField*/}
        {/*                    name="email"*/}
        {/*                    control={form.control}*/}
        {/*                    render={({ field }) => (*/}
        {/*                        <FormItem>*/}
        {/*                            <FormLabel>Email</FormLabel>*/}
        {/*                            <FormControl>*/}
        {/*                                <Input placeholder="" {...field}/>*/}
        {/*                            </FormControl>*/}

        {/*                            <FormMessage />*/}
        {/*                        </FormItem>*/}
        {/*                    )}*/}
        {/*                />*/}
        {/*                <FormField*/}
        {/*                    name="password"*/}
        {/*                    control={form.control}*/}
        {/*                    render={({ field }) => (*/}
        {/*                        <FormItem>*/}
        {/*                            <FormLabel>Password</FormLabel>*/}
        {/*                            <FormControl>*/}
        {/*                                <Input placeholder="" {...field} type='password'/>*/}
        {/*                            </FormControl>*/}
        {/*                            <FormMessage />*/}
        {/*                        </FormItem>*/}
        {/*                    )}*/}
        {/*                />*/}
        {/*                <Button type="submit" disabled={isFormSubmitting}>*/}
        {/*                    {*/}
        {/*                        isFormSubmitting ?*/}
        {/*                            <>*/}
        {/*                                <Loader2 className={'mr-2 h-4 w-4'}/>*/}
        {/*                            </>*/}
        {/*                            :'Sign Up'*/}
        {/*                    }*/}
        {/*                </Button>*/}
        {/*            </form>*/}
        {/*        </Form>*/}
        {/*    </div>*/}

        {/*</div>*/}
    </>
}

export default SignInPage