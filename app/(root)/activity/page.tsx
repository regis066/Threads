import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUserPosts, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

 
 
const Page = async () => {
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');


    //get activity

    const activities = await getActivity(userInfo._id)
    return (
      <section>
          <h1 className="head-text mb-10">Activity</h1>


          {activities.length > 0 ? (
            <>
             {activities.map((activity)=> (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image 
                  src={activity.author.image}
                  alt='Profile Picture'
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{activity.author.name}</span>
                    <span>{" "}replied to your Thread</span>
                  </p>
                </article>
              </Link>
            ))}
            </>
           
          ) : (
            <p className="!text-base-regular text-light-3">No Activity yet</p>
          ) }
      </section>
    )
  }
  
  export default Page