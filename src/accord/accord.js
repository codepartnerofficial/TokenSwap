import React, { useState } from 'react';
import {questions} from './Api';
import MyAccord from './MyAccord';

const Accord = () =>{
  const [data, setData]=useState(questions);

    return(
        <>
        <section className='main-div'>
        <div className='content'>
        <h1>React Interview Questions</h1>
        {
            data.map((curElem) =>{
                const { id }=curElem;
                return <MyAccord key={id} {...curElem}/>
            })
        }
        </div>
        </section>
        </>
    )
}

export default Accord;