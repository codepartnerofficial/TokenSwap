import React, { useState } from "react";

const NoteWrite = (props) => {

const [note, setNote] = useState({
    title : '',
    message : ''
});

const texting = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    
    setNote((preData) =>{
        return{
            ...preData,
            [name]:value
        };
    });
};

const addNote = () =>{
    props.passNote(note);
    setNote({title : '',
        message : ''})
};






    return(
        <>
        <div className='notewrite'>
        <input type='text' placeholder='Title' name='title' value={note.title} onChange={texting} />
        <textarea placeholder='Type Note...' name='message' value={note.message} onChange={texting} />
        <button onClick={addNote}>+</button>
        </div>
        </>
    )
}


export default NoteWrite;