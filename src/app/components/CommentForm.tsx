import { useState } from "react";
import { FaPaperPlane, FaRegPaperPlane } from "react-icons/fa";

const CommentForm = () => {
    const [content, setContent] = useState<string>(''); 

    return(
        <div className="relative flex flex-row items-center bg-transparent rounded-lg mb-3 mt-3 p-3">
            <input
            className='px-4 py-2 w-full border rounded-md'
            type="text"
            placeholder="Drop a comment!"
            value={content}
            onChange={(e) => setContent(e.target.value)} 
            />
            <button className="bg-[#9fade3] hover:bg-[#8694cb] text-white px-4 py-2 rounded-lg font-semibold">
                Comment!
            </button>
        </div>
    );
}

export default CommentForm;
