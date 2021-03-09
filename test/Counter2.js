import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "../src/module.js";

export default function Counter2(){

    const {fire, actions, getState} = useStoreHook("appStore");
    
    return(<>
          <h3>Current Value: {getState().counter}</h3> 
          <button id="inc" onClick={(e)=>{ fire(actions.increment(1) ); e.preventDefault(); } } >Increment by 1</button>
          <button id="dec" onClick={(e)=>{ fire(actions.decrement(1) ); e.preventDefault(); }} >Decrement by 1</button>
    </>);
}
