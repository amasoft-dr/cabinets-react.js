import { useStoreHook, StateProvider } from "../src/module.js";
import React from "react";
import TestRenderer from 'react-test-renderer';


const { act } = TestRenderer;

const counterStore = {
    name: "counter",
    initState: 0,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
    }
}
test('adds 1 + 2 to equal 3', () => {
    let renderer;
    act(() => {
        renderer = TestRenderer.create(<StateProvider store={counterStore} />);
    });
  
    expect(store.getState()).toBe(0);
});