import { useState } from "react";
import { FaPaperPlane, FaRegPaperPlane } from "react-icons/fa";

const CommentForm = () => {
    const [content, setContent] = useState<string>(''); 

    return(
        <div className="relative flex flex-row items-center bg-[#191919] rounded-lg mb-3 mt-3 p-3">
            <input
            type="text"
            placeholder="Drop a comment!"
            className={`flex-grow rounded-lg bg-[#646464] m-3 h-10 focus:outline-none focus:outline-green-400 p-3`}
            value={content}
            onChange={(e) => setContent(e.target.value)} 
            />
            <FaRegPaperPlane color='#1DB954'/>
        </div>
    );
}

export default CommentForm;
