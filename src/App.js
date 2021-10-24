import './App.css';
import Post from "./Post.js"
import {useState,useEffect} from "react"
import {db} from "./firebase.js"
import { collection, onSnapshot,orderBy } from "firebase/firestore";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import {auth} from "./firebase.js";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword ,onAuthStateChanged,updateProfile,signOut} from '@firebase/auth';
import ImageUpload from './ImageUpload.js';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const[open,setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const[username,setUsername] = useState("");
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const [user,setUser] = useState(null);

  useEffect(() =>{
    const unsubscribe =  onAuthStateChanged(auth,(authUser) => {
      if(authUser){
        //user has logged in 
        console.log(authUser);
        setUser(authUser);
      }
      else{
        //user has logged out
        setUser(null);
      }
    })

    return () =>{
      unsubscribe();
    }
  },[user,username])

  useEffect(() =>{
    const unsub = onSnapshot(collection(db, "posts"), orderBy("timestamp","desc") , (snapshot) => {
    setPosts(snapshot.docs.map(doc => ({
      id:doc.id,
      post:doc.data()
    })));
  });
  },[])

  const signUp = (event) =>{
    event.preventDefault();
    createUserWithEmailAndPassword(auth,email,password)
    .then((authUser)=>{
      return updateProfile(authUser.user,{
          displayName:username
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) =>{
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error.message)) 

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Instagram-Icon.png" alt="" />
            </center>
            <Input placeholder="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Instagram-Icon.png" alt="" />
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img className="app_headerImage" src = "https://upload.wikimedia.org/wikipedia/commons/0/06/%C4%B0nstagram-Profilime-Kim-Bakt%C4%B1-1.png" alt ="" />
        {user ? (
        <Button onClick={() => signOut(auth)}>Logout</Button>
      ):(
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}
      </div>
      <div className="app_posts">
      {
        posts.map(({id,post}) => {
          return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} /> 
        })
      }
      </div>
      {/* <h1>hey there gorgeous hello</h1> */}
      {user?.displayName ? (
        <ImageUpload username= {user.displayName}/>
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
