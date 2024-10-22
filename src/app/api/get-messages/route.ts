import {dbConnect} from "@/lib/dbConnection";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export async function GET(request:Request)
{
    await dbConnect()
    const session= await getServerSession(authOptions)
    const user:User= session?.user

    if(!session && !session?.user)
    {
        return Response.json({
                success:false,
                message:'You are not authorized'
            },
            {status:401}
        )
    }
    const userId=  new mongoose.Types.ObjectId(user?._id)
    try {
        const user= await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'$message.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}

        ])

        if(!user || user?.length===0)
        {
            return Response.json({
                    success:false,
                    message:'User not found'
                },
                {status:400}
            )
        }
        return Response.json({
                success:true,
                messages:user[0].messages
            },
            {status:200}
        )
    }catch(err){
        console.log("Error in getting user messages",err)
        return Response.json({
            success:false,
            message:"Failed to get user messages"
        },{
            status:500
            }
        )
    }

}