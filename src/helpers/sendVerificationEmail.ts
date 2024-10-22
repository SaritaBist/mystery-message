import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse";
import verificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>
{
    try {
         await resend.emails.send({
             from: 'onboarding@resend.dev',
             to: email,
             subject: 'Mystery message verification code',
             react: verificationEmail({username,otp:verifyCode}),
         });
        return {success:true,message:'Verification message send succesfully'}
    }
    catch(emailError)
    {
        console.error(`Error sending verification email to ${email}:`, emailError);
        return {success: false, message: "Failed to send verification email."};
    }
}