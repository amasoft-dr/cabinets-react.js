import { setupStore, combineStores } from "cabinets";

class CabinetsReactError extends Error {
    constructor(msg, error) {
        super(msg);
        this.name = "CabinetsReactError";
        this.message += ` ${error.message}`;
    }
}
export default function StateProvider(props) {
    const { store, stores, combine = false, combinedName } = props;

    useEffect(() => {
        try {
             if (!stores || !stores)
                throw new CabinetsReactError("Error a store or stores must be specified");

            if (stores && stores)
                throw new CabinetsReactError("You should use store for single" +
                    " store setting up or stores for multiple but not both");
                    
            if (store) {
                setupStore(store);
            } else if (stores && !combine) {
                stores.forEach(st => setupStore(st));
            } else if (stores && combine) {
                if (!combinedName)
                    throw new CabinetsReactError("combinedName prop cannot be undefined or empty when" +
                        "combining store, please, supply a name for stores " +
                        "combination.", e);

                const setupStores = stores.map(store => setupStore(store));
                combineStores(...setupStores);
            }
        } catch (e) {
            throw new CabinetsReactError("Error while resgestering Cabinets Stores", e);
        }

        // eslint-disable-next-line
    }, []);

    return <>{props.children}</>;
}
