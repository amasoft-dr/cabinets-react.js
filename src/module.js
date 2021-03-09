import { useEffect, useState } from "react";
import { useStore } from "kabinets";
import StateProvider from "./StateProvider.js";
 

class KabinetsReactError extends Error {
    constructor(msg, error="") {
        super(msg);
        this.name = "KabinetsReactError";
        this.message +=  error;
    }
}

/**
 * useStoreHook It's a hook which allows you to get access
 * to a cabinets.js store.
 * 
 * @param {string} storeName - The store's name to access.
 * @param {Array} deps - Component will be notified only when those store's propeties changes.
 */
function useStoreHook(storeName, deps) {
  const { actions, lazyActions, fire, lazyFire, getState, subscribe } = useStore(storeName);
  const [state, setState] = useState(getState());
  useEffect(() => {
    subscribe(setState, deps);
    // eslint-disable-next-line
  }, []);

  return { actions, lazyActions, fire, lazyFire, getState, subscribe };
}

export {useStoreHook, StateProvider, KabinetsReactError}; 