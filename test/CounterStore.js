
const counterStore = {
    name: "counter",
    initState: 10,
    operations: {
        increment: (state, payload) => {
          state.counter = state.counter + payload;
          return {...state};
        },
        decrement: (state, payload) => {
           state.counter = state.counter - payload;
           return {...state};
        }
     }
}

export {counterStore};