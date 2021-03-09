import React from "react";
import { useStoreHook } from "../src/module.js";

export default function CounterMessage() {

  const { getState } = useStoreHook("counterStore");

  return (<>

    {getState() > 100 && <h1>We have {getState()} clicks we are getting rich</h1>

      || getState() > 50 && <h1>Keep going, we have only {getState()} I want more clicks</h1>

      || getState() > 10 && <h1>You just warm up. We have {getState()}, Click Please</h1>

      || getState() > 1 && <h1>Nice, we have now {getState()} Clicks!</h1>

      || getState() == 0 && <h1>Don't be shy, please click!</h1>}

  </>);
}