"use client"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
// import { updateUser } from '@/lib/actions/user.actions';
import { CommentValidation } from '@/lib/validations/thread';
// import { createThread } from '@/lib/actions/thread.actions';
import Image from 'next/image'
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface Prop {
    threadID: string;
    currentUserId: string;
    currentUserImg: string;
}


const Comment = ({threadID , currentUserId, currentUserImg}: Prop) => {

    const  pathname  = usePathname();
    const router = useRouter();
  
  
      const form = useForm({
          resolver: zodResolver(CommentValidation),
          defaultValues: {
             thread: '',
          }
      })

      const onSubmit = async (values: z.infer<typeof CommentValidation>) =>{
          await addCommentToThread(threadID,values.thread, currentUserId, pathname)

          form.reset()
      }     
    return (
        <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='comment-form'
        >
             <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem className='flex items-center gap-3 w-full'>
            <FormLabel>
              <Image 
               src= {currentUserImg}
               alt='Profile Image'
               width={28}
               height={28}
               className='rounded-full object-cover'
              />
            </FormLabel>
            <FormControl className="border-none bg-transparent">
              <Input
              type='text'
              placeholder='Comment...' 
              className='no-focus text-light-1 outline-none'
              {...field}   
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type='submit' className='comment-form_btn'>
         Reply
      </Button>
        </form>

    </Form>
    )
}
export default Comment;