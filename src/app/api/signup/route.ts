import {dbConnect} from "@/lib/dbConnection"
import UserModel, {Message} from "@/model/User";
import bcrypt from "bcryptjs"
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
     await dbConnect()
     try {
       const {email,username,password}= await request.json()
        const existingUserVerifiedByUserName= await UserModel.findOne({
             username,
             isVerified:true
        })
          if(existingUserVerifiedByUserName)
          {
               return Response.json({
                    success:false,
                    message:"Username already exists"
               },
                   {status:400}
               )
          }
        const existingUserByEmail= await UserModel.findOne({email})
          const verifyCode=Math.floor(100000 + Math.random() * 900000).toString()

          if(existingUserByEmail)
          {
               if(existingUserByEmail.isVerified)
               {
                    return Response.json({
                             success:false,
                             message:"User already exists for this email id"
                        },
                        {status:400}
                    )
               }
               else {
                    const hashedPassword= await bcrypt.hash(password,10)
                    const verifyCodeExpiry=new Date()
                    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours()+1)
                    existingUserByEmail.password = hashedPassword
                    existingUserByEmail.verifyCode=verifyCode
                    existingUserByEmail.verifyCodeExpiry=verifyCodeExpiry
                    await existingUserByEmail.save()
               }
          }
          else {
              const hashedPassword= await bcrypt.hash(password,10)
               const verifyCodeExpiry=new Date()
                verifyCodeExpiry.setHours(verifyCodeExpiry.getHours()+1)

               const newUser=new UserModel({
                    username,
                    email,
                    password:hashedPassword,
                    verifyCode:verifyCode,
                    verifyCodeExpiry,
                    isVerified:false,
                    isAcceptingMessage:true,
                    messages:[]
               })
               await newUser.save()

          }
          const emailResponse=await sendVerificationEmail(
               email,
               username,
               verifyCode
          )
         if(!emailResponse.success)
         {
              return Response.json({
                   success:false,
                   message:emailResponse.message
              },{status:500})
         }

          return Response.json({
               success:true,
               message:'User Registered successfully Please verify your email'
          },{status:201})


     }
     catch(error)
     {
          console.log("Error in regestering user",error)
          return Response.json({
               success:false,
               message:"Failed to register user"
          },
              {status:500}
          )
     }
}