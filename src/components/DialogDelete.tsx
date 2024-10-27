// ** React Imports
import {Fragment, useEffect, useState} from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'


import {
    Card,
    CardContent,
    CardHeader,
    Typography
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import {Icon} from "@iconify/react";




const DialogDelete = ({ show, handleDialog ,handleDelete}) => {
    const handleClick=()=>{
        handleDelete()
        handleDialog(false)
    }

    return (

        <Fragment>
            <Dialog
                open={show}
                maxWidth='xs'
                sx={{'& .MuiDialog-paper': {overflow: 'visible'}}}

            >
                <DialogTitle id='alert-dialog-title'></DialogTitle>
                <DialogContent

                >

                    <Toaster position='top-right' reverseOrder={false}/>

                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '& svg': {  color: 'warning.main' }
                        }}
                    >
                        <Icon icon='tabler:alert-circle' fontSize='3rem' />
                        <Typography variant='h6' sx={{ mb:1, fontWeight:600 }}>
                            Are you sure you want to delete?
                        </Typography>
                    </Box>
                    <Box sx={{mt:3,display:'flex',gap:3}}>
                        <Button variant='tonal' color='secondary' onClick={() => handleDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant='contained' sx={{ mr: 3 }} onClick={handleClick}>
                            Delete
                        </Button>
                    </Box>
                </DialogContent>


            </Dialog>
        </Fragment>


    )
}


export default DialogDelete
