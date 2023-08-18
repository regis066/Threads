"use server"


import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: null,
    path: string,

}


export async function createThread({text, author, communityId, path}:Params){
    try {
        connectToDB();

    const createdThread = await Thread.create({
        text,
        author,
        communityId: null,

    })

    // UPDATE USER MODEL
    await User.findByIdAndUpdate(author , {
        $push: {threads: createdThread._id}
    })

    revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Failed to create thread: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20 ){
    connectToDB();


    //calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch posts that have no parents (top-level threads ...)

    const postsQuery = Thread.find({ parentId : { $in: [null, undefined]}}).sort({ createdAt: 'desc'}).skip(skipAmount).limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }

    })

    const totalPostsCount = await Thread.countDocuments({ parentId : { $in: [null, undefined]}})

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return {posts , isNext}
}

export async function fetchThreadById(id: string) {
    connectToDB()

    try {
        const thread = await Thread.findById(id).populate(
            {
                path: 'author',
                model: User,
                select:"_id id name image"
            }
        ).populate (
            {
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }
        ).exec();

        return thread;
    } catch (error:any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }

}

export async function addCommentToThread(
    threadID: string,
    commentText: string,
    userId: string,
    path: string
     ){
        connectToDB()

        try {

            //FIND ORIGINAL THREAD BY ID
            const originalThread = await Thread.findById(threadID);
            if(!originalThread){
                throw new Error(`Thread not Found`)
            }

            //CREATE NEW THREAD WITH COMMENT TEXT
            const commentThread = new Thread({
                text: commentText,
                author: userId,
                parentId: threadID,
            })


            //SAVE THE NEW THREAD

            const savedCommentThread = await commentThread.save();
            
            
            //UPDATE THE ORIGINAL THREAD TO INCLUDE THE COMMENT

            originalThread.children.push(savedCommentThread._id)

            //SAVE THE ORIGINAL THREAD

            await originalThread.save()

            revalidatePath(path)
        } catch (error:any) {
            throw new Error(`Error adding comment to Thread: ${error.message}`)
            
        }

}
