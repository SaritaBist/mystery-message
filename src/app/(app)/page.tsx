"use client"
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
 import './style.css'
import message from'@/message.json'

import { Autoplay, Navigation } from 'swiper/modules';
import {Box, Typography} from "@mui/material";

export default function Home() {
    return (
        <Box sx={{display:'flex',flexDirection:'column',textAlign:'center',justifyContent:'center',mt:10}}>
            <Typography variant='h3'>Dive Into the World of Anonymous Feedback</Typography>
            <Typography>True feedback- where your identify remains a secret</Typography>
            <>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}

                    navigation={true}
                    modules={[Autoplay, Navigation]}
                    className="mySwiper"
                >
                    {
                        message?.map((m) =>(
                            <SwiperSlide key={m.id} style={{borderRadius:'5px'}}>
                                <Box sx={{}}>
                                    <Typography variant='h5' sx={{mb:1}}>{m.title}</Typography>
                                    <Typography variant='body' sx={{mb:2}}>{m.content}</Typography>
                                    <Typography variant='body2'>{m.received}</Typography>
                                </Box>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
            </>
        </Box>
    );
}
