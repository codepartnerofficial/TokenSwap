import React, { useState } from 'react';

const App = () =>{

const [curr, upp] =useState(0);

const inc = () =>{
    upp(curr+1);
}
const dec = () =>{
    if(curr==0){
        alert('Reached minimum limit');
    }
    else{
        upp(curr-1);
    }
}

  return(
    <>
    <div className='main_div'>
    <div className='center_div'>
        <h1> {curr} </h1>
    <div class='btn_div'>
        <button onClick={inc}>+</button>
        <button onClick={dec}>-</button>
    </div>
    </div>
    </div>
    </>
  )
}





export default App;