import React,{ useState,useEffect } from 'react'
import "./post.css";
import Avatar from '@material-ui/core/Avatar';
import { doc, onSnapshot,collection,addDoc, serverTimestamp, orderBy} from "firebase/firestore";
import {db} from "./firebase.js"

function Post({postId,user,username,caption,imageUrl}) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            const temp = doc(db, "posts", postId);
            unsubscribe = onSnapshot(collection(temp,"comments"),orderBy("timestamp","desc"),(snapshot) =>{
                setComments(snapshot.docs.map(doc=> doc.data()))
            })
        }
        return () =>{
            unsubscribe();
        }
    },[postId])

    const postComment = (event) =>{
        event.preventDefault();
        const flag = doc(db, "posts", postId);
        addDoc(collection(flag,"comments"),{
            text:comment,
            username:user.displayName,
            timestamp: serverTimestamp()
        });
        setComment("");
    }
    return (
        <div className="post">
            <div className="post_header">
                <Avatar className="post_avatar" alt="Puspesh" src = "/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img className="post_image" src = {imageUrl} alt = "" />
            <h4 className="post_text"><strong>{username}</strong> : {caption}</h4>

            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> : {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post_commentBox">
                <input className="post_input" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <button disabled={!comment} className="post_button" type="submit" onClick={postComment}>Post</button>
            </form>
            )}
        </div>
    )
}

export default Post
