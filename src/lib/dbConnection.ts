import mongoose from "mongoose";

type ConnectionObj={
    isConnected?: number
} 

const connection:ConnectionObj={}

export async  function dbConnect():Promise<void>{
  if(connection.isConnected)
  {
    console.log("Already connected to db")
    return
  }
   try{

    const db= await mongoose.connect(process.env.MONGODB_URL || '')
    console.log(db)
    connection.isConnected=db.connections[0].readyState

   }catch(error)
   {
    console.log("Database connection failed")
     process.exit()
   }
}
