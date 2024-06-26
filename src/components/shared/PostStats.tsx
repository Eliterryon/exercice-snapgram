import { Models } from "appwrite";
import React, { useState, useEffect } from "react";

import { checkIsLiked } from "@/lib/utils";
import { useDeleteSavedPostMutation, useGetCurrentUserMutation, useLikePostMutation, useSavePostMutation } from "@/lib/react-querry/QueriesAndMutaiton";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => { 
    const likesList = post.likes.map((user: Models.Document) => user.$id);

    const [likes, setLikes] = useState<string[]>(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost } = useLikePostMutation();
    const { mutate: savePost } = useSavePostMutation(); 
    const { mutate: deleteSavePost } = useDeleteSavedPostMutation();
  
    const { data: currentUser } = useGetCurrentUserMutation();

    const savedPostRecord = currentUser?.saves.find((record: Models.Document) => record.post.$id === post.$id);
    
    useEffect(() => {setIsSaved(!!savedPostRecord);}, [currentUser]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];

        if (newLikes.includes(userId)){
            newLikes = newLikes.filter((id) => id !==userId)
        }else{
            newLikes.push(userId)
        }

        setLikes(newLikes)
        likePost({postId: post.$id, likesArray: newLikes})

    };
    
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedPostRecord){
            setIsSaved(false);
            return deleteSavePost(savedPostRecord.$id)
        }

        savePost({ userId: userId, postId: post.$id });
        setIsSaved(true);
    };

    return (
        <div className={`flex justify-between items-center z-20`}>
            <div className="flex gap-2 mr-5">
            <img
                src={`${checkIsLiked(likes, userId)? "/assets/icons/liked.svg" :"/assets/icons/like.svg"}`}
                alt="like"
                width={20}
                height={20}
                onClick={handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>

            <div className="flex gap-2">
                <img
                    src={`${isSaved? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}`}
                    alt="share"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                    onClick={handleSavePost}
                />
            </div>
        </div>
    );
};

export default PostStats;