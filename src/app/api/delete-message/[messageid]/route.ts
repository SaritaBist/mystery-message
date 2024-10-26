import {dbConnect} from "@/lib/dbConnection";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";



export async function DELETE(request:Request,{params}:{params:{messageid:string}})
{
    const messageId= params?.messageid
    await dbConnect()
    const session= await getServerSession(authOptions)
    const user:User= session?.user as User

    if(!session && !session?.user)
    {
        return Response.json({
                success:false,
                message:'You are not authorized'
            },
            {status:401}
        )
    }
    try {
         const updatedResult=await UserModel.updateOne(
             {_id:user._id},
             {$pull:{messages:{_id:messageId}}}
         )

        if(updatedResult.modifiedCount==0)
        {
            return Response.json({
                    success:false,
                    message:'Message not found or already deleted'
                },
                {status:404}
            )
        }
        return Response.json({
                success:true,
                message:'Message deleted successfully'
            },
            {status:200}
        )
    }
    catch(error)
    {
        return Response.json({
                success:false,
                message:'Error in delete message'
            },
            {status:500}
        )
    }


}