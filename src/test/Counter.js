import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "cabinets-react";

export default function Counter(){

    const {fire, actions, getState} = useStoreHook("counterStore");
    
    return(<>
          <h3>Current Value: {getState()}</h3>
          <button id="inc" onClick={(e)=>{ fire(actions.increment(1) ); e.preventDefault(); } } >Increment by 1</button>
          <button id="dec" onClick={(e)=>{ fire(actions.decrement(1) ); e.preventDefault(); }} >Decrement by 1</button>
    </>);
}
