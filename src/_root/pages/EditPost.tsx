import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader";
import { useGetPostByIdMutation } from "@/lib/react-querry/QueriesAndMutaiton";
import { useParams } from "react-router-dom"

const EditPost = () => {
  const  { id } = useParams();
  const { data: post, isPending} = useGetPostByIdMutation(id || '')
  
  if (isPending) return <Loader/>

  return (
    <div className="flex fles-1">
        <div className="common-container">
            <div className="max-w-5x1 flex-start gap-3 justify-start w-full">
                <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add"/>
                <h2 className="h3-bold md:h2-blod text-left w-full">Edit post</h2>
            </div>
            <PostForm action = "update" post={post}/>
        </div>
    </div>
)
}


export default EditPost