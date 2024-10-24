import CredentialsProvider from "next-auth/providers/credentials"
import {NextAuthOptions} from "next-auth";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import {dbConnect} from "@/lib/dbConnection";

export const authOptions: NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text ", placeholder: "john@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnect()
                console.log(credentials)

                try {
                  const user= await UserModel.findOne({
                      $or:[
                          {email:credentials.email},
                          {username: credentials.username}
                      ]
                  })
                    console.log("user...",user)
                  if(!user)
                  {
                      throw new Error("User not found")
                  }
                  if(!user?.isVerified)
                  {
                      throw new Error("Please verify your account before login")
                  }
                  const isPasswordMatch= await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordMatch)
                    {
                        return user
                    }
                    else {
                        throw new Error("Incorrect Password")
                    }
                }
                catch(err:any)
                {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user }) {
            if(user)
            {
                token._id = user?._id.toString()
                token.isVerified = user?.isVerified
                token.isAcceptingMessage = user?.isAcceptingMessage
                token.username = user?.username
            }
            return token
        },
        async session({ session, token }) {
            if(token)
            {
                session.user._id = token?._id
                session.user.isVerified=  token.isVerified
                session.user.isAcceptingMessage=token.isAcceptingMessage
                session.user.username= token.username
            }
            return session
        }

    },
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}