import {useEffect} from "react";
import { setupStore, combineStores } from "cabinets";

class CabinetsReactError extends Error {
    constructor(msg, error="") {
        super(msg);
        this.name = "CabinetsReactError";
        this.message +=  error;
    }
}

export default function StateProvider(props) {
    
    const { store, stores, combine = false, combinedName } = props;

    useEffect(() => {
        try {
             console.log(store);
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
                combineStores(...setupStores);
            }
        } catch (e) {
            console.log(e);
            throw new CabinetsReactError("Error while resgestering Cabinets Stores", e);
        }

        // eslint-disable-next-line
    }, []);

    //This is a component not intended to be used as parent component of other components...
    return null;
}
