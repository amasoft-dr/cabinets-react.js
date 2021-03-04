import React from "react";
import { mount} from 'enzyme';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { StateProvider } from "../module.js";
import Counter from "./Counter.js";



Enzyme.configure({ adapter: new Adapter() })

const counterStore = {
    name: "counterStore",
    initState: 0,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
    }
} 

it('validates registered store by modifying state by clicking', () => {

    mount(<StateProvider store={counterStore} />);
    const counterWrapper = mount(<Counter/> );
    const incBtnWrapper = counterWrapper.find("#inc");
    const decBtnWrapper = counterWrapper.find("#dec");
    incBtnWrapper.simulate("click");
    incBtnWrapper.simulate("click");
    decBtnWrapper.simulate("click");
    const h1Value = counterWrapper.find("h3").text();
    expect(h1Value).toBe("Current Value: 1");
});