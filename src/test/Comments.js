import React, { useState } from "react"; //Not required from React +17
import { useStoreHook } from "../module.js";
import Comment from "./Comment.js";

export default function Comments() {

    const { fire, actions, getState } = useStoreHook("commentStore");
    const [commentMsg, setCommentMsg] = useState("");


    return (<>
        <h2>Please leave your comment anonymously</h2>

        <form id="form" onSubmit={(e) =>{ fire(actions.comment(commentMsg)); e.preventDefault() }} >
            <label htmlFor="comment">Leave a comment</label>
            <input id="comment" type="text" name="comment" onChange={(e) => setCommentMsg(e.target.value)} />
            <hr />
            <input   type="submit" value="Submit" />
        </form>

        <h3>Comments({getState().length})</h3>
        {getState()
            .map(com => <Comment comment={com} key={com.id}
                onDelete={ () => fire(actions.removeComent(com.id)) } />) 
        }

    </>);
}