 import {dbConnect} from "@/lib/dbConnection";
 import UserModel from "@/model/User";

export async function POST(request: Request)
{
     await dbConnect()
    // rest of your code here
    try {
        const {username,code}= await request.json()
      console.log(request.json())
        // code for verifying the code and updating the user's status as verified or not'

        const decodedUsername=decodeURIComponent(username)
        const user= await UserModel.findOne({username})
        if(!user)
        {
            return Response.json({
                    success:false,
                    message:"User not found"
                },
                {
                    status:500
                })
        }

        const verifyCode = user.verifyCode===code

        const isCodeNotExpired=  new Date(user.verifyCodeExpiry) >
             new Date()
        if(verifyCode && isCodeNotExpired)
        {
          user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"Email verified successfully"
            },
            {
                status:200
            })
        }
        else if(!isCodeNotExpired)
        {
            return Response.json({
                success:false,
                message:"Verification code expired please sign up for new code"
            },
            {
                status:400
            })
        }
        else {
            return Response.json({
                success:false,
                message:"Invalid verification code"
            },
            {
                status:400
            })
        }

    }catch(err){
        console.log("Error in verify code",err)
        return Response.json({
            success:false,
            message:"Failed to verify code"
        },{
            status:500
            }
        )
    }





}