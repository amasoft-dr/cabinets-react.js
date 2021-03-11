## Kabinets-react.js is the simplest Global State Management for React.js
### Kabinets-react.js It's a binding to use kabinets.js in modern React.js

Please, feel free to explore [kabinets.js](https://github.com/amasoft-dr/kabinets.js) the original library.

### Managing Global State in React using kabinets

#### CodeSandbox Kabinets-react.js examples
1.  [Using Simple store](https://codesandbox.io/s/wonderful-mestorf-ob5tq)
2.  [Using multiple stores](https://codesandbox.io/s/priceless-hill-fg4t4?file=/src/App.js)
3.  [Combining Multiple Stores](https://codesandbox.io/s/delicate-morning-ri1xt?file=/src/App.js)

Kabinets-react.js is a react state management library that is designed with simplicity in mind
you don't need to configure anything, just add the dependency to your project and start using it!.

```bash
npm i kabinets-react
```
Kabinets-react.js module just define one hook and one react component:

1. **StateProvider** Component allows you to add and configure your Stores so they 
can be available to any react component.

2. **useStoreHook** a hook that allows you to use a store and get important functions
to retrieve all actions, to fire an action, to fire lazy actions, to get the state, and even subscribe
to state notifications.

### Let's code

First thing is to define your store/stores.

There are two ways to set up your stores

1. The **kabinets.js** standard way, please [click here for more details](https://github.com/amasoft-dr/kabinets.js/blob/main/README.md#lets-code)

2. The **kabinets-react.js** way, let's see it:

file: **CounterStore.js**
```javascript

const counterStore = {
  name: "counterStore",
  initState: 0,
  operations: {
    increment: (state, payload) => state + payload,
    decrement: (state, payload) => state - payload
  }
};

export { counterStore };


```

Let's use **StateProvider** component to register this store.

```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
//#1
import {StateProvider} from "kabinets-react";
//#2
import {counterStore} from "./CounterStore.js";
//#3
import Counter from "./Counter.js";

function App(){
  
  return(<>
   <StateProvider store={counterStore} />
   <Counter />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );
```

1. Importing **StateProvider** from *kabinets-react*. Now all your components have access to the *counterStore*.

2. Importing the *counterStore* The store we created for this example.

3. Importing the component that uses kabinets to store its Global State.


Let's see the code for **Counter.js** component.

```JSX
import React from "react"; //Not required from React +17
//#1
import { useStoreHook } from "kabinets-react";

export default function Counter() {
  const { fire, actions, getState } = useStoreHook("appState", ["counter"]);

  return (
    <>
      <h3>Current Value: {getState().counter}</h3>
      <button onClick={(e) => {fire(actions.increment(1));  e.preventDefault(); }}  >
        Increment by 1
      </button>
      <button onClick={(e) => {fire(actions.decrement(1)); e.preventDefault(); }} >
        Decrement by 1
      </button>
    </>
  );
}

```

1. *useStoreHook* is a hook that returns a store. It takes another argument
*deps* which is optional, an array of property names. If no *deps* are specified
then every time Object mutates, **kabinets-react** will notify react to re-render the component.
When *deps* are specified, then **kabinets-react** will only notify when those particular object's properties
has changed, this is particularly useful when you combined multiple stores as you'll see later.

 For this example we are using basic values we don't need to specify any dependency. (We'll see an example later on)

Now you can see the **Counter** Component using and triggering actions that will update the state what
will provoke component re-rendering.

So, let's create another component, called **CounterMessage** basically, it will read the state for the
*counterStore* and will show a message depending on the value of the state.

File **CounterMessage.js**

```JSX
import React from "react";
import { useStoreHook } from "kabinets-react";
 
export default function CounterMessage() {
  //#1
  const { getState } = useStoreHook("counterStore");

  return (<>

    {getState() > 100 && <h1>We have {getState()} clicks we are getting rich</h1>

      || getState() > 50 && <h1>Keep going, we have only {getState()} I want more clicks</h1>

      || getState() > 10 && <h1>You just warm up. We have {getState()}, Click Please</h1>

      || getState() > 0 && <h1>Nice, we have now {getState()} Clicks!</h1>

      || getState() === 0 && <h1>Don't be shy, please click!</h1>}

  </>);
}

```
Now let's see how we can change the state triggering actions from one component and making
another component to re-render because of state change.


```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "kabinets-react";
import {counterStore} from "./CounterStore.js";
import Counter from "./Counter.js";
import CounterMessage from "./CounterMessage.js";

function App(){
  
  return(<>

       <StateProvider store={counterStore} />
       <Counter />
       <CounterMessage />

  </>);
}

render(<App />, document.querySelector("#react-root") );

```

1. Every time *counterStore* changes, the *CounterMessage* component will be re-render.

2. Every time users click the increment or decrement button, all components that subscribe to that store will be re-rendered. (By default a component get subscribed just using *useStoreHook*)

### Registering more than 2 Stores

There are times that you want to use more than 1 store, probably to manage some states
independently from each other, or because you want to combine them.

**kabinets-react** support an easy way to register more than one state, or even combine them. Please, see how *kabinets.js*: [ handle multiple stores in kabinets]( https://github.com/amasoft-dr/kabinets.js#using-multiple-stores).

**kabinets-react.js** makes easier how to set up multiple stores and how to combine them than **kabinets.js**.

Let's say we want to store our anonymous comments and have a counter in our application.

Let's define our **AppStores.js**

```javascript
const counterStore = {
  name: "counterStore",
  initState: 10,
  operations: {
    increment: (state, payload) => state + payload,
    decrement: (state, payload) => state - payload
  }
};

const commentsStore = {
  name: "commentsStore",
  initState: [],
  operations: {
    comment: (state, comment) => [...state, comment],
    removeComment: (state, id) => state.filter((comment) => comment.id !== id)
  },
  maps: {
    //#1
    comment: (state, payload) => {
      //Converting simple String for comment reducer, into a msg object to be passed to the
      //comment reducer.
      const id =
        [...payload].map((c) => c.charCodeAt(0)).join("") +
        "_" +
        new Date().getTime();
      return { msg: payload, id, date: new Date() };
    }
  }
};

export { counterStore, commentsStore };


```

The **AppStores.js** file export 2 stores, one four counting and the other to store comments.

##### Important note about the comment Store: Maps

1. The *commentStore* defines two operations: **comment** and **removeComment**, also
defines a **map** for comment operation, meaning, it will transform the payload from simple
String to a **comment** object which contains: **comment, id and date** prior to being passed to the 
reducer(**The function that is associated with the action comment**).

Now, if you want to use both Stores in your application just pass an array of store
to a the **<StateProvider />** component.

Let's code:


```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "kabinets-react";
import {counterStore, commentStore } from "./AppStores.js";
import Counter from "./Counter.js";
import Comments from "./Comments.js";

function App(){
  
  return(<>
   
   <StateProvider stores={[counterStore, commentStore]} />
   <Counter />
   <CounterMessage />
   <Comments />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );

```

1.- Now, all components have access to both **counterStore** and **commentStore**


**Comments.js** file

```JSX
import React, { useState } from "react";
import { useStoreHook } from "kabinets-react";
import Comment from "./Comment.js";

export default function Comments() {
  const { fire, actions, getState } = useStoreHook("commentsStore");
  const [commentMsg, setCommentMsg] = useState();

  return (
    <>
      <h3>Please leave your comment anonymously </h3>

      <form
        onSubmit={(e) => {
          fire(actions.comment(commentMsg));
          setCommentMsg("");
          e.preventDefault();
        }}
      >
        <label htmlFor="comment">Leave a comment</label>
        <input
          type="text"
          size="50"
          name="comment"
          value={commentMsg}
          onChange={(e) => setCommentMsg(e.target.value)}
        />
        <hr />
        <input id="submit" type="submit" value="Leave a comment" />
      </form>

      <h2>Comments({getState() && getState().length})</h2>
      {getState().map((comment) => (
        <Comment
          comment={comment}
          key={comment.id}
          onDelete={() => fire(actions.removeComment(comment.id))}
        />
      ))}
    </>
  );
}

```
**Comment.js** file

```JSX
import React from "react"; //Not required from React +17

export default function Comment({ comment, onDelete }) {
  return (
    <div>
      <p>
        {comment.msg}
        <b>{comment.date.toLocaleString()}</b>
      </p>
      <button onClick={(e) => { e.preventDefault(); onDelete(); }} >
        Delete
      </button>
      <hr />
    </div>
  );
}


```

So you could see, every time a new comment is added  only the **Comments** Component will be rendered
and every time the **counter** increased or decreased both, **Counter** and **CounterMessage** will
be rendered.

### Combining multiple smalls Stores as one single fat Store.

Sometimes is a good idea to have small stores in different files and later on
combined them all as one big fat store.

Let's see some advantages:

1. It helps you to distribute development work, you can assign different substores to different developers. Say god bye merging conflicts!
    
    
2. Help you with code maintainability, They are easier to write, read, and test. You avoid
    the problem to code one Big App Store with a lot of operations, reducer, mappings, 
    interceptors, lazy operations...forget about Big Store with thousands of line of 
    codes that cannot be edited by more than one developer at the same time.
    
    
3. You gain access to all substores that are part of this combined-store. When using multiple independent
    stores you cannot access other independent stores data, with combined stores, you can access and even 
    fire state changes of all other substores that are combined.
    

For deeper information about combining stores please check [how kabinets.js combines multiple stores](https://github.com/amasoft-dr/kabinets.js/blob/main/README.md#combining-stores).

***Note**: Is a valid way to set up your store using kabinets.js standard way, also combined them, but it is preferable 
when using react to use **<StateProvider />** Component to set up and combine your stores.*

**So, enough theory, let's code!**

**CounterStore.js** file


```javascript

const counterStore = {
  name: "counter",
  initState: 10,
  operations: {
    increment: (state, payload) => {
      state.counter = state.counter + payload;
      return { ...state };
    },
    decrement: (state, payload) => {
      state.counter = state.counter + payload;
      return { ...state };
    }
  }
};

export { counterStore };

```


**CommentsStore.js** file

```javascript
//helper function
const stringId = (str) =>
  [...str].map((c) => c.charCodeAt(0)).join("") + "_" + new Date().getTime();

const commentsStore = {
  name: "comments",
  initState: [],
  operations: {
    comment: (state, comment) => {
      state.comments = [...state.comments, comment];
      return { ...state };
    },
    removeComment: (state, payload) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== payload
      );
      return { ...state };
    }
  },
  maps: {
    comment: (state, comment) => {
      return { msg: comment, id: stringId(comment), date: new Date() };
    }
  }
};

export { commentsStore };

```
Now let's combine them in the **App.js** file

```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "kabinets-react";
import {counterStore, commentStore } from "./AppStores.js";
import Counter from "./Counter.js";
import Comments from "./Comments.js";

function App(){
  
  return(<>
 
      <StateProvider
            stores={[counterStore, commentsStore]}
            combine={true}
            combinedName="appState"
        />

      <Counter />
      <CounterMessage />
      <Comments />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );

```
Now, **CounterMessage,Counter, and Comments**  needs to be updated
so they access to their specific substore and in this case
that those stores are not very much related we want to keep
subscription separated from each other, meaning, one change on counter
does not trigger a notification for Comments re-rendering. (However, there a times
that this is good)

File **Counter.js**

```JSX
import React from "react"; //Not required from React +17
//#1
import { useStoreHook } from "kabinets-react";

export default function Counter() {
  const { fire, actions, getState } = useStoreHook("appState", ["counter"]);

  return (
    <>
      <h3>Current Value: {getState().counter}</h3>
      <button onClick={(e) =>{fire(actions.increment(1));e.preventDefault();  }} >
        Increment by 1
      </button>
      <button onClick={(e) => {fire(actions.decrement(1));e.preventDefault();}} >
        Decrement by 1
      </button>
    </>
  );
}

```


File **CounterMessage.js**

```JSX
import React from "react";
import { useStoreHook } from "kabinets-react";
 
export default function CounterMessage() {
  //#1
  const { getState } = useStoreHook("counterStore",["counter"]);

  return (<>

    {getState() > 100 && <h1>We have {getState()} clicks we are getting rich</h1>

      || getState() > 50 && <h1>Keep going, we have only {getState()} I want more clicks</h1>

      || getState() > 10 && <h1>You just warm up. We have {getState()}, Click Please</h1>

      || getState() > 0 && <h1>Nice, we have now {getState()} Clicks!</h1>

      || getState() === 0 && <h1>Don't be shy, please click!</h1>}

  </>);
}


```

**Comments.js** file

```JSX
import React, { useState } from "react";
import { useStoreHook } from "kabinets-react";
import Comment from "./Comment.js";

export default function Comments() {
  const { fire, actions, getState } = useStoreHook("appState", ["comments"]);
  const [commentMsg, setCommentMsg] = useState();

  return (
    <>
      <h3>Please leave your comment anonymously </h3>

      <form
        onSubmit={(e) => {
          fire(actions.comment(commentMsg));
          setCommentMsg("");
          e.preventDefault();
        }}
      >
        <label htmlFor="comment">Leave a comment</label>
        <input
          type="text"
          size="50"
          name="comment"
          value={commentMsg}
          onChange={(e) => setCommentMsg(e.target.value)}
        />
        <hr />
        <input id="submit" type="submit" value="Leave a comment" />
      </form>

      <h2>Comments({getState().comments && getState().comments.length})</h2>
      {getState().comments &&
        getState().comments.map((comment) => (
          <Comment
            comment={comment}
            key={comment.id}
            onDelete={() => fire(actions.removeComment(comment.id))}
          />
        ))}
    </>
  );
}

```

**Comment.js** is a stateless components so 
file remains the same, no changes at all.
```JSX
import React from "react"; //Not required from React +17

export default function Comment({ comment, onDelete }) {
  return (
    <div>
      <p>
        {comment.msg}
        <b>{comment.date.toLocaleString()}</b>
      </p>
      <button onClick={(e) => { e.preventDefault(); onDelete(); }} >
        Delete
      </button>
      <hr />
    </div>
  );
}

```

### Maps: Transforming payload prior to executing reducers
Already we saw how Maps works, [Check here](#important-note-about-the-comment-store-maps)

Only need to be said that you can have a **def** mapper that will
be used for each operation/action that does not have a map function.
It's like if you defined a **def** mapper it will catch all payload
from all actions prior to being passed to the reducer, so the transformation
can be done.


### Interceptors: Executing code after mappings are done  prior reducer is called
Interceptors are functions that are called after Maps are executed but prior
reducer to be invoked.

They allows to do simple operations like logging, or save state & payload to
localStorage or even modify both, state & payload. You can think of Interceptors
like a Map function on steroides.

You can define interceptor for specific operations or for all
just defining the **def** Interceptor.

examples:

```javascript
const counterStore = {
    name: "counter",
    initState: 10,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
     },
    interceptors:{
        increment: (state, payload)=>{
            console.log(`Increment: current: ${state} inc. value: ${payload}`);
        },
        decrement: (state, payload)=>{
            if( (state - payload) < 0 ){
                return 0;
            }
            return {state, payload};
        }
    }
}

```

Or if you want to intercept all operations in a particular stores just use **def** as interceptor:


```javascript
const counterStore = {
    name: "counter",
    initState: 10,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
     },
    interceptors:{
        def: (state, payload, ctx)=>{
            console.log(`${ctx.reducer}, current state: ${state} payload: ${payload}`);
        }
    }
}

```
Note: **def** interceptor will only intercepts those operations which do not have an interceptor.

### Lazy Actions: Modifying your store in an async away
If your store must be mutates in an async way you could use
Lazy Actions. Which basicaclly allows you to fire async actions.

So, imagine you need to get 2 random numbers

```javascript
const counterStore = {
  name: "counter",
  initState: 0,
  lazyOperations: {
    increment: async (state, payload) => {
      state += payload;
      return state;
    },
    decrement: async (state, payload) => {
      state.counter -= payload;
      return state;
    }
  }
}

it("Checks if lazy operations are working in combined-stores", async () => {
  const { lazyActions, lazyFire, getState } = setupStore(counterStore);
  //state.counter is 10...
  const state = await lazyFire(lazyActions.increment(10));
  expect(getState().counter).toBe(20);
});

```

When to use Lazy Operations?

If you want to fetch data or you need to invoke other async APIs, then you could use 
Lazy Operations to mutate your state in an async way.

However, there is also another approach:

You could have all your state mutations Sync, as normal operations
if you need to fetch some data or invoke some async API you can
do it outsite your store's code  and when you have the data you
can pass this data as payload while invoking an operation/reducer
this will keep your store simple and cleaner!

## That's all we have for now!
If you need more examples, please check all test in the Repo.

If you want to collaborate just fork it!

