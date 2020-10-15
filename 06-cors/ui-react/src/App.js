import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [teacherName, setTeacherName] = useState("")

  // WE WANNA DO A POST TO A DIFFERENT DOMAIN
  // WE CALL THIS A "CROSS-ORIGIN" request
  const onSubmit = (e) => {
    console.log("Submit handler called")
    e.preventDefault()

    console.log("Teacher name to send:", teacherName)

    // POST call to backend
    fetch('http://localhost:5000/teachers', {
      method: "POST",
      // header Content-Type we tell, whats inside this crazy package we 
      // are sending. The backend needs to know, otherwise it will ignore it!
      headers: {
        "Content-Type": "application/json"
      },
      // JSON data we want to send to a backend always needs to 
      // be send as a STRING over the wire
      // the backend will parse that string back into an javascript object
      body: JSON.stringify( { name: teacherName } )
    })
  }  

  return (
    <div className="App">
      <h1>Add this teacher</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input name="name" type="text" onChange={(e) => setTeacherName(e.target.value)} />
        </div>
        <button>Add</button>
      </form>
    </div>
  );

}

export default App;
