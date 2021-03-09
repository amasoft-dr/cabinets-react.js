import React from "react"; //Not required from React +17

export default function Comment({comment, onDelete}) {

    return (
        <div>
            <p>
                {comment.msg}
            </p>
            <b>{comment.date.toString()}</b>
            <a onClick={(e) => { e.preventDefault(); onDelete(); }}>Remove comment</a>
            <hr/>
        </div >
    );
}
