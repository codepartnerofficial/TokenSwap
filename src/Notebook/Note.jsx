import React from "react";

const Note = (props) => {

const deleteNote = () =>{
    props.deleteItem(props.id);
};

    return(
        <>
        <div className='mainNote'>
        <div className='Note'>
            <h2>{props.title}</h2>
            <p> {props.message} </p>
            <button onClick={deleteNote}>-</button>
        </div>
        </div>
        </>
    )
}

export default Note;