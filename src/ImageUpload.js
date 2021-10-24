import React,{useState} from 'react'
import { Button} from '@material-ui/core';
import {db,storage} from "./firebase.js"
import { ref, uploadBytesResumable ,getDownloadURL} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./ImageUpload.css"; 

function ImageUpload({username}) {
    const [caption,setCaption] = useState("");
    const [image,setImage] = useState("");
    const [progress,setProgress] = useState(0);

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () =>{
        const uploadTask = uploadBytesResumable(ref(storage,`images/${image.name}`),image);

        uploadTask.on('state_changed',
        (snapshot) =>{
            const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
        },
        (error) =>{
            console.log(error);
        },
        () =>{
            //complete function
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log('File available at', downloadURL);
                addDoc(collection(db, "posts"), {
                    timestamp:serverTimestamp(),
                    caption: caption,
                    imageUrl: downloadURL,
                    username:username
                  })
                  setProgress(0);
                  setCaption("");
                  setImage(null);
              });
        }
        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" placeholder="enter a caption" onChange={event =>setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button className="imageupload_button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
