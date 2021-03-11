import { useEffect, useState } from "react";
import { useStore, setupStore, combineStores } from "kabinets";


class KabinetsReactError extends Error {
    constructor(msg, error = "") {
        super(msg);
        this.name = "KabinetsReactError";
        this.message += error;
    }
}

/**
 * useStoreHook It's a hook which allows you to get access
 * to a kabinets.js store.
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



/**
 * The State Provider Component allows you to register
 * one or more stores. In case more than one Store
 * are specified, they can be combined in a single fat-store.
 * 
 * @param {Object} store - a valid store object ref.
 * @param {Array} stores - an array of stores object refs.
 * @param {boolean} combine - indicates if multiple stores must be combined.
 * @param {string} combinedName - name of the new combined Stores in case Stores must be combined.
 */
function StateProvider({ store, stores, combinedName, combine = false }) {

    try {
        if (store && useStore(store.name))
            return null;

        if (combinedName && useStore(combinedName))
            return null;

        if (stores && !combinedName && stores
            .map(store => useStore(store.name))
            .filter(store => store).length > 0)
            return null;

            

        if (!stores && !store)
            throw new KabinetsReactError("Error a store or stores must be specified");

        if (stores && store)
            throw new KabinetsReactError("You should use store for single" +
                " store setting up or stores for multiple but not both");

        if (store) {
            setupStore(store);
        } else if (stores && !combine) {
            stores.forEach(st => setupStore(st));
        } else if (stores && combine) {

            if (!combinedName)
                throw new KabinetsReactError("combinedName prop cannot be undefined or empty while" +
                    "combining stores, please, supply a name for stores " +
                    "combination.");

            const setupStores = stores.map(store => setupStore(store));
            combineStores(combinedName, ...setupStores);
        }
    } catch (e) {
        throw new KabinetsReactError("Error while resgestering Kabinets Stores", e);
    }


    //This is a component not intended to be used as parent component of other components...
    return null;
}



export { useStoreHook, StateProvider, KabinetsReactError }; 