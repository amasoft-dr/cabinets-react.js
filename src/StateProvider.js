import {useEffect} from "react";
import { setupStore, combineStores } from "cabinets";
import {CabinetsReactError}  from "./module.js";

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
export default function StateProvider({store, stores, combinedName,  combine = false}) {

    useEffect(() => {
        try {
             if (!stores && !store)
                throw new CabinetsReactError("Error a store or stores must be specified");

            if (stores && store)
                throw new CabinetsReactError("You should use store for single" +
                    " store setting up or stores for multiple but not both");
    
            if (store) {
                setupStore(store);
            } else if (stores && !combine) {  
                stores.forEach(st => setupStore(st));
            } else if (stores && combine) {
        
                if (!combinedName)
                    throw new CabinetsReactError("combinedName prop cannot be undefined or empty while" +
                        "combining stores, please, supply a name for stores " +
                        "combination.");

                const setupStores = stores.map(store => setupStore(store));
                combineStores(combinedName, ...setupStores);
            }
        } catch (e) {
            console.error(e);
            throw new CabinetsReactError("Error while resgestering Cabinets Stores", e);
        }

        // eslint-disable-next-line
    }, []);

    //This is a component not intended to be used as parent component of other components...
    return null;
}
