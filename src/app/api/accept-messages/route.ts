import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import {dbConnect} from "@/lib/dbConnection";
import UserModel from "@/model/User";

export async function POST(request:Request)
{
    await dbConnect()
    const session= await getServerSession(authOptions)
    const user:User= session?.user
    console.log(user)
     if(!session && !session?.user)
     {
         return Response.json({
             success:false,
             message:'You are not authorized'
         },
             {status:401}
         )
     }
    const userId= user?._id
    const {acceptedMessage}= await  request.json()

     try {

          const updatedUser= await UserModel.findByIdAndUpdate(
              userId,
              {isAcceptingMessage:acceptedMessage},
              {new:true}
              )

         if(!updatedUser)
         {
             console.log("Failed to update status of accepting message",err)
             return Response.json({
                     success:false,
                     message:'Failed to update status of accepting message'
                 },
                 {status:401}
             )
         }

         return Response.json({
                 success:true,
                 message:'Accepted Message status updated successfully',
                 updatedUser
             },
             {status:200}
         )
     }
     catch(err){
         console.log("Error in accepting message",err)
         return Response.json({
             success:false,
             message:'Failed to send message'
         },
             {status:500}
         )
     }


}

export async function GET(request:Request){
     await dbConnect()
    const session= await getServerSession(authOptions)
    const user:User= session?.user
    console.log(user)
    if(!session && !session?.user)
    {
        return Response.json({
                success:false,
                message:'You are not authorized'
            },
            {status:401}
        )
    }
    const userId= user?._id
    try {
         const foundUser= await UserModel.find({userId})
         if(!foundUser)
         {
             console.log("User not foound")
             return Response.json({
                     success:false,
                     message:'User not found'
                 },
                 {status:401}
             )
         }
         return Response.json({
             success:true,
             isAcceptingMessage: foundUser?.isAcceptingMessage,
         },
             {
                 status:200
             })

    }
    catch(err)
    {
        console.log("Error in  getting message acceptance",err)
        return Response.json({
                success:false,
                message:'Failed i getting  message acceptance'
            },
            {status:500}
        )
    }

}

