import { useStoreHook, StateProvider } from "../src/module.js";
import React from "react";
import renderer from 'react-test-renderer';

const counterStore = {
    name: "counter",
    initState: 0,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
    }
}
test('adds 1 + 2 to equal 3', () => {
    const el = renderer.create(<StateProvider store={counterStore} /> );
    //const store = useStoreHook("counter");
    expect(1).toBe(1);
});