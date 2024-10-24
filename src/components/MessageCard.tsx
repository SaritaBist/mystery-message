"use client"
import {Box, Button, Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
const MessageCard=()=>{
    return<>
        <Card>
            <CardHeader></CardHeader>
            <CardContent>
               <Box sx={{display:'flex', gap:4}}>
                   <Box>
                       <Typography>Sarita Bist</Typography>
                       <Typography>Mar23, 2024</Typography>
                   </Box>
                  <Button variant='contained' sx={{backgroundColor:'red'}}> <CloseIcon onClick={()=>console.log("Hello")}></CloseIcon></Button>
               </Box>
            </CardContent>
        </Card>
    </>
}
export  default MessageCard