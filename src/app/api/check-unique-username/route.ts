
import {dbConnect} from "@/lib/dbConnection";
import {z} from "zod"
import {userNameValidationSchema} from "@/schemas/signUpSchema";
import UserModel from "@/model/User";

const UsernameQuerySchema=z.object({
    username:userNameValidationSchema
})

export  async function GET(request:Request){
    await dbConnect()
    try {
      const {searchParams}=new URL(request.url)
        console.log(searchParams)
        const queryParams={
          username:searchParams.get('username'),
        }
        console.log(queryParams)
        const result=UsernameQuerySchema.safeParse(queryParams)
        console.log(result)
        if(!result.success)
        {
            const usernameError=result.error.format()
                .username?._errors || []
            return Response.json({
                success:false,
                message:usernameError.length >0 ?usernameError.join(",") : 'invalid query parameters'
            },{
                status:400
            })
        }
        const {username}=result.data

        //check if username exists in the database
        const existingVerifiedUser= await UserModel.findOne({
            username,isVerified:true})

        if(existingVerifiedUser)
        {
            return Response.json({
                success:false,
                message:"Username already exists"
            },{
                status:400
            })
        }
       else {
            return Response.json({
                success:true,
                message:"Username is unique "
            },{
                status:201
            })
        }
    }
    catch(err)
    {
        console.log('Error in check username',err)
        return Response.json({
            success:false,
            message:'Failed to check username'
        },
        {
            status:500
        }
        )

    }
}