"use client"
import {signOut, useSession} from "next-auth/react";
import {User} from "next-auth";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";

const Navbar=()=>{
    const {data:session}=useSession()
    const user:User= session?.user as User

    return<>
        <Box sx={{  }}>
            <AppBar position="static" sx={{ backgroundColor: "#F0F0F0",color:'black' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1,color:'blue' }}>
                        Mystery Message
                    </Typography>
                    {
                        session ?
                            <Box sx={{display:'flex',gap:3,alignItems:'center'}}>
                            <Typography>Welcome {user?.username || user?.email}</Typography>
                                <Button variant='contained' onClick={()=>signOut()}>Logout</Button>
                          </Box>:
                            (
                                <Button variant='contained' href="/sign-in">Login</Button>
                            )
                    }

                </Toolbar>
            </AppBar>
        </Box>
    </>
}
export default  Navbar