import React from "react";
import { mount } from 'enzyme';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { StateProvider, CabinetsReactError } from "../module.js";
import { counterStore } from "./CounterStore.js";
import { commentsStore, commentsStore2 } from "./CommentsStore.js";
import { useStore } from "cabinets";
import Counter from "./Counter.js";
import Counter2 from "./Counter2.js";
import Comments from "./Comments.js";
import Comments2 from "./Comments2.js";
import CounterMessage from "./CounterMessage.js";




Enzyme.configure({ adapter: new Adapter() })

const basicCounterStore = {
    name: "counterStore",
    initState: 0,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
    }
}

it('validates registered store by modifying state by clicking', () => {
    mount(<StateProvider store={basicCounterStore} />);
    const counterWrapper = mount(<Counter />);
    const counterWrapper2 = mount(<Counter />);
    const incBtnWrapper = counterWrapper.find("#inc");
    const decBtnWrapper = counterWrapper.find("#dec");
    Array.from({ length: 100 }, (x, i) => incBtnWrapper.simulate("click"));
    decBtnWrapper.simulate("click");
    const h3Value = counterWrapper.find("h3").text();
    expect(h3Value).toBe("Current Value: 99");
    expect(counterWrapper2.find("h3").text()).toBe("Current Value: 99");
});

//Previous Counter store value was 99 according to previous step
it('validates re-rendering on state mutations in multiple components', () => {
    mount(<StateProvider store={counterStore} />);
    const counterWrapper = mount(<Counter />);
    const counterMsgWrapper = mount(<CounterMessage />);
    const counterMsgH1Text = () => counterMsgWrapper.find("h1").text();
    expect(counterMsgH1Text()).toBe("Keep going, we have only 99 I want more clicks");
    const incBtnWrapper = counterWrapper.find("#inc");
    const decBtnWrapper = counterWrapper.find("#dec");
    //Clicking button 100 times...
    Array.from({ length: 100 }, (x, i) => incBtnWrapper.simulate("click"));
    const h1Value = counterWrapper.find("h3").text();
    expect(h1Value).toBe("Current Value: 199");
    expect(counterMsgH1Text()).toBe("We have 199 clicks we are getting rich");
});

it('Validates component with states and nested compoents ', () => {
    mount(<StateProvider store={commentsStore2} />);
    const comWrapper = mount(<Comments />);
    comWrapper.find('#comment').simulate("change", { target: { value: "Hello I'm Dimitron, bye!" } });
    comWrapper.find("#form").simulate("submit");
    expect(comWrapper.exists("Comment")).toBe(true);
    expect(comWrapper.find("p").text().trim()).toBe("Hello I'm Dimitron, bye!");
    comWrapper.find("a").simulate("click");
    expect(comWrapper.exists("Comment")).toBe(false);

});

it('validates if combining stores works', () => {
    mount(<StateProvider stores={[counterStore, commentsStore]}
        combine={true} combinedName="appStore" />);

    const c2 = mount(<Counter2 />);
    const incBtnWrapper = c2.find("#inc");
    const decBtnWrapper = c2.find("#dec");
    Array.from({ length: 10 }, (x, i) => incBtnWrapper.simulate("click"));
    decBtnWrapper.simulate("click");
    const h3Value = c2.find("h3").text();
    expect(h3Value).toBe("Current Value: 19");

    const comWrapper = mount(<Comments2 />);
    comWrapper.find('#comment').simulate("change", { target: { value: "Hello I'm Dimitron, bye!" } });
    comWrapper.find("#form").simulate("submit");
    expect(comWrapper.exists("Comment")).toBe(true);
    expect(comWrapper.find("p").text().trim()).toBe("Hello I'm Dimitron, bye!");
    comWrapper.find("a").simulate("click");
    expect(comWrapper.exists("Comment")).toBe(false);

});

it("Verifies StateProvider Errors", () => {
    const t = () => {
        mount(<StateProvider />);
    };
    const t2 = () => {
        mount(<StateProvider stores={[counterStore, commentsStore]} store={commentsStore} />);
    };
    const t3 = () => {
        mount(<StateProvider stores={[counterStore, commentsStore]} combine={true} />);
    };
    
    expect(t).toThrow(CabinetsReactError);
    expect(t2).toThrow(CabinetsReactError);
    expect(t3).toThrow(CabinetsReactError);

})



