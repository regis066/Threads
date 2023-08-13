import mongoose from 'mongoose'


let isConnected  = false;

export const connectToDB = async () =>{
    mongoose.set('strictQuery' , true);


    if(!process.env.MONGO_URI) return console.log('MONGO_URI Not Found');
    if(isConnected) return console.log('Already connected to DB');

    try {
        await mongoose.connect(process.env.MONGO_URI)

        isConnected = true;
    } catch (error) {
        console.log(error);
        
    }
    
}