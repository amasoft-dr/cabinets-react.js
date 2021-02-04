import { useEffect, useState } from "react";
import { useStore } from "cabinets";
import StateProvider from "./src/StateProvider.js";
 
function useStoreHook(storeName, deps) {
  const { actions, lazyActions, fire, lazyFire, getState, subscribe } = useStore(storeName);
  const [state, setState] = useState(getState());
  useEffect(() => {
    console.debug(
      `Subscribing setState hook for ${storeName}...` + JSON.stringify(state)
    );
    subscribe(setState, deps);
    // eslint-disable-next-line
  }, []);

  return { actions, lazyActions, fire, lazyFire, getState, subscribe };
}

export {useStoreHook, StateProvider};