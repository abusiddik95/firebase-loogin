import React from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig)


function App() {

  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = ()=> {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message)
    })
  }

  const handleSignOut= () => {
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        error: '',
        password: '',
        isValid: false,
        existingUser: false
      }
      setUser(signOutUser);
      console.log(res);
    })
    .catch(err=>{

    })
  }

  const is_valid_email = email =>/(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  
  const switchForm = event => {
    const createdUser = {...user};
        createdUser.existingUser = event.target.checked;
        setUser(createdUser);
  }

  const handleChange = event => {
    const newUserInfo = {
      ...user 
    };
let isValid = true;
if(event.target.name ==='email'){
  isValid=is_valid_email(event.target.value);
}
if(event.target.name ==='password'){
  isValid =event.target.value.length > 8 && hasNumber(event.target.value);
}

    newUserInfo[event.target.name] = event.target.value ;
    newUserInfo.isValid = isValid ;
    setUser(newUserInfo);
  }

  const createAccount = (event) =>{
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(err =>{
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
   
    event.preventDefault();
    event.target.reset();
    
  }
  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(err =>{
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      { user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button>:
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div> <p>Welcome, {user.name} </p>
        <p>your email: {user.email}</p>
        <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm" >Returning User</label>
      

      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      <input onBlur={handleChange} type="text" name="email" placeholder="Your Email" required/>
      <br/>
      <input onBlur={handleChange} type="password" name="password" placeholder="Your Password" required/>
      <br/>
      <input type="submit" value="Sign In"/>
      </form>


      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input onBlur={handleChange} type="text" name="name" placeholder="Your Name" required/>
      <br/>
      <input onBlur={handleChange} type="text" name="email" placeholder="Your Email" required/>
      <br/>
      <input onBlur={handleChange} type="password" name="password" placeholder="Your Password" required/>
      <br/>
      <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'Red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
