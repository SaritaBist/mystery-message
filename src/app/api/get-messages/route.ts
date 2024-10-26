import {dbConnect} from "@/lib/dbConnection";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: 'You are not authorized',
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user?._id);

    try {
        const filteredUser = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]);

        // Check if user was found but has no messages
        if (filteredUser.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 400 }
            );
        } else if (filteredUser[0].messages.length === 0) {
            return Response.json(
                {
                    success: true,
                    message: 'User has no messages',
                    messages: [],
                },
                { status: 200 }
            );
        }

        // User found with messages
        return Response.json(
            {
                success: true,
                messages: filteredUser[0].messages,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("Error in getting user messages", err);
        return Response.json(
            {
                success: false,
                message: 'Failed to get user messages',
            },
            { status: 500 }
        );
    }
}
