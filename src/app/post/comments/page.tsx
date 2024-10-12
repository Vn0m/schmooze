import Comments from "@/app/components/Comments"

interface CommentsProps {
    postId: string;
}

const CommentsPage: React.FC<CommentsProps> = ({ postId }) => {
  return (
    <div>
        <Comments postId={postId}/>
    </div>
  )
}

export default CommentsPage