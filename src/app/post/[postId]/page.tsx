import Navbar from "@/app/components/Navbar";
import Post from "../../components/Post";

const PostPage = ({ params }: { params: { postId: string } }) => {
    const { postId } = params;
    return (
        <div className="bg-black grid grid-cols-5 gap-8 p-4 text-lg h-screen">
            <Navbar />
            <div className="col-span-3 bg-[#191919] overflow-y-auto h-full rounded-lg">
                <Post postId={postId} className="w-full h-full" />
            </div>
            <div className="col-span-1 bg-[#191919] rounded-lg h-full">
                Friends
            </div>
        </div>
    );
};

export default PostPage;
