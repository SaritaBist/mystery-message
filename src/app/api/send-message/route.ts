import {dbConnect} from "@/lib/dbConnection";
import UserModel from "@/model/User";


export async function POST(request:Request)
{
    await dbConnect()
    try {
         const {username,content} = await request.json();
         const user= await UserModel.find({username})
        if(!user)
        {
            return Response.json({
                    success:false,
                    message:'User not found'
                },
                {status:400}
            )
        }
        if(!user.isAcceptingMessage)
        {
            return Response.json({
                    success:false,
                    message:'User is not accepting message'
                },
                {status:403}
            )
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage)
         await user.save()

         return Response.json({
                success:true,
                message:"Message sent successfully"
            },
            {
                status:200
            })

    }catch(error)
    {
        console.log("Error in getting user messages",error)
        return Response.json({
                success:false,
                message:"Internal Server error"
            },{
                status:500
            }
        )
    }
}