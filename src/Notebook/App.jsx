import React, { useState } from "react";
import Header from './Header';
import NoteWrite from './NoteWrite';
import Note from './Note';

const App = ()=>{
  const [addItem, setAddItem] = useState([]);
const addNo = (note) => {
    setAddItem((prevdatas) =>{
        return [...prevdatas, note];
    });
};

const onDelete = (id) =>{
    setAddItem((oldData) =>{
        oldData.filter((currdata, indx)=>{
            return indx !== id;
        })
    })
}



    return(
        <>
        <Header />
        <NoteWrite passNote={addNo} />

        {addItem.map((val, index)=>{
            return(
            <Note 
            key={index}
            id={index}
            title={val.title}
            message={val.message}
            deleteItem={onDelete}
               />
        );
        })};

        </>
    );
};

export default App;