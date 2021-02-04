## Cabinets-react.js the simplest Global State Management for React.js
### Cabinets-react.js It's a binding to use Cabinets.js in modern React.js

Please, feel free to explore [Cabinets.js](https://github.com/amasoft-dr/cabinets.js) the original library.

### Managing Global State in React using Cabinets

Cabinets-react.js is a binding of Cabinets.js library to be used in React.js in an easy
In and fun way, you don't need to configure anything.

Cabinets-react.js module just define 1 hook and one react component:

1. **StateProvider** Component allows you to add and configure your Stores so they 
can be available to any react component.

2. **useStoreHook** a hook that allows you to use an store and get important functions
to get all actions, to fire an action, to fire lazy actions, to get the state and even subscribe
to state notifications.

### Let's code

1. First thing is to define your store/stores.

There are two ways to setup your stores

-First the **Cabinets.js** standard way, please [click here for more details](https://github.com/amasoft-dr/cabinets.js/blob/main/README.md#lets-code)

-The **Cabinets-react.js** way, let's see it:

file: **CounterStore.js**
```javascript

const counterStore = {
    name: "counter",
    initState: 0,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
}

export counterStore;

```

Let's use **StateProvider** component to register this store.

```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
//#1
import {StateProvider} from "cabinets-react";
//#2
import {counterStore} from "./CounterStore.js";
//#3
import Counter from "./Counter.js";

function App(){
  
  return(<>
   /*#3*/
   <StateProvider store={counterStore} />
   <Counter />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );
```

1.- Importing **StateProvider** from *cabinets-react*. Now all your components
    has access to the *counterStore*.

2.- Importing the *counterStore* The store we created for this example.

3.- Importing the component that uses Cabinets to store its Global State.


Let's see the code for **Counter.js** component.

```JSX
import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "cabinets-react";

export default function Counter(){
    const {fire, actions, getState} = useStoreHook("counterStore");
    
    return(<>
      <h3>Current Value: {getState()} </h3>
      <button onClick={(e)=>{ fire(actions.increment(1)'; e.preventDefault(); } >Increment by 1</button>
      <button  onClick={(e)=>{ fire(actions.decrement(1)'; e.preventDefault(); } >Decrement by 1</button>
    </>);
}


```

-1. Importing the *useStoreHook* it is a hook that returns a store. It takes another argument
*deps*, which is an array of property names, so you can subscribe when these properties change
in this case, hence we are using basic values we don't need to specify any dependency. (We'll see an example later on)

Now you can see the **Counter** Component using and triggering actions that will update the state what
will provoke component re-rendering.

So, let's create another component, called **CounterMessage** basically, it will read the state for the
*counterStore* and will show a message depending on the value of the state.

File **CounterMessage.js**

```JSX
import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "cabinets-react";

export default function CounterMessage(){
    const {getState} = useStoreHook("counterStore");
    
    return(<>
    
      {getState() > 100 && <h1> We have {getState() } clicks we are getting rich </h1>
      
      {getState() > 50 &&  getState() < 99 && <h1>Keep going, we have only {getState() } I want more clicks </h1> }
      
      {getState() > 10  &&  getState() < 50 && <h1>You just warm up. We have {getState() }. Click Please </h1> }
      
      {getState() > 1  &&  getState() < 10 && <h1>Nice, we have now {getState() }. Click! </h1> }
      
      {getState() == 0  && <h1>Don't be shy, please click! </h1> }

    </>);
}

```
Now let's see how we can change the state triggering actions from one component and making
another component to re-render because of state change.


```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "cabinets-react";
import {counterStore} from "./CounterStore.js";
import Counter from "./Counter.js";
import CounterMessage from "./CounterMessage.js";

function App(){
  
  return(<>
   <StateProvider store={counterStore} />
   /*#1*/
   <CounterMessage />
   /*#2*/
   <Counter />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );

```

-1. Every time *counterStore* changes, the *CounterMessage* component will be re-render.

-2. Every time users click the increment or decrement button, all components that subscribe to that store wil be re-rendered.(By default a component get subscribed just using *useStoreHook*)

### Registering more than 2 Stores

There are times that you want to use more than 1 store, probably to manage some states
independently from each other, or because you want to combine them.

**Cabinets-react** support an easy way to register more than one state, or even combine them. Please, see how *Cabinets.js*: [ handle multiple stores in Cabinets]( https://github.com/amasoft-dr/cabinets.js#using-multiple-stores).

**Cabinets-react.js** makes easier how to set up multiple stores and how to combine them than **Cabinets.js**.

Let's say we want to store our anonymous comments and have a counter in our application.

Let's define our **AppStores.js**

```javascript

const counterStore = {
    name: "counter",
    initState: 10,
    operations: {
        increment: (state, payload) => state + payload,
        decrement: (state, payload) => state - payload
     }
}

const commentsStore = {
    name: "comments",
    initState: [],
    operations: {
        comment: (state, comment) =>  [...state, msg],
        removeComent: (state, id) => state.filter(comment => comment.id !== id)
     },
     maps: {
       //#1
       comment: (payload) => {
        //Converting simple String for comment reducer, into a msg object to be passed to the
        //comment reducer.
        const id = [...payload].map(c => c.charCodeAt(0) ).join("") + "_" + new Date().getTime();
        return {msg:payload, id, date: new Date() } 
       }
     }
     
}

export {counterStore, commentsStore};

```

The **AppStores.js** file export 2 stores, one four counting and the other to store comments.

Important note about the comment Store:


1-The *commentStore* defines two operations: **comment** and **removeComment**, also
defines a **map** for comment operation, meaning, it will transform the payload from simple
String to a **comment** object which contains: **comment, id and date** prior to being passed to the 
reducer(**The function that is associated with the action comment**).

Now, if you want to use both Stores in your application just pass an array of store
to a the **<StateProvider />** component.

Let's code:


```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "cabinets-react";
import {counterStore, commentStore } from "./AppStores.js";
import Counter from "./Counter.js";
import Comments from "./Comments.js";

function App(){
  
  return(<>
  /*#1*/
   <StateProvider stores={[counterStore, commentStore]} />
   <CounterMessage />
   <Counter />
   <Comments />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );

```

1.- Now, all components have access to both **counterStore** and **commentStore**


**Comments.js** file


```JSX
import React,{useState} from "react"; //Not required from React +17
import {useStoreHook} from "cabinets-react";
import Comment from "./Comment.js";

export default function Comments(){
    const {fire, actions,getState} = useStoreHook("commentsStore");
    const {commentMsg, setCommentMsg} = useState();
    
    
    return(<>
       <h3>Please leave your comment anonymously </h3>
       
       <form onSubmit={()=> fire(actions.comment(commentMsg) } >
         <label htmlFor="comment">Leave a comment</label>
         <input type="text" name="comment" onChange={(e)=> setCommentMsg() } />
         <hr/>
         <submit>Publish</submit>
       </form>
       
       <h2>Comments</h2>
       { getState().map(comment => <Comment comment={comment}
                                    onDelete={ ()=>fire(actions.removeComment(comment.id) ) } />
                       ) 
       }      
    
    </>);
}

```
**Comment.js** file

```JSX
import React from "react"; //Not required from React +17

export default function Comment(props){
    const {comment} = props;
    
    return(<>
       <div>
         <p>
           {comment.msg}
         </p>
         <i>{comment.date}</i>
         <a onClick={e.preventDefault(); props.onDelete(); }>
          Remove comment
         </a>
       </div>
    </>);
}

```

So you could see, every time a new comment is added  only the **Comments** Component will be rendered
and every time the **counter** increased or decreased both, **Counter** and **CounterMessage** will
be rendered.

### Combining multiple smalls Stores as one single fat Store.

Sometimes is a good idea to have small stores in different files and later on
combined them all as one big fat stores.

Let's see some advantages:

-1. It helps you to distribute development work, you can assign different 
    substores to different developers. Say god bye merging conflicts!
    
    
-2. Help you with code maintainability, They are easier to write, to read, and to test. You avoid
    the problem to code one Big App Store with a lot of operations, reducer, mappings, 
    interceptors, lazy operations...forget about Big Store with thousands of line of 
    codes that cannot be edited by more than one developer at the same time.
    
    
-3. You gain access to all substores that are part of this combined-store. When using multiple independent
    stores you cannot access other independent stores data, with combined stores, you can access and even 
    fire state changes of all other substores that are combined.
    

For deeper information about combining stores please check [how Cabinets.js combines multiple stores](https://github.com/amasoft-dr/cabinets.js/blob/main/README.md#combining-stores).

***Note**: Is a valid way to setup your store using Cabinets.js standard way, also combined them, but it is preferible 
when using react to use **<StateProvider />** Component to setup and combine your stores.*

**So, enough theory, let's code!**

**CounterStore.js** file


```javascript

const counterStore = {
    name: "counter",
    initState: 10,
    operations: {
        increment: (state, payload) => {
          state.counter = state.counter + payload;
          return state;
        },
        decrement: (state, payload) => {
           state.counter = state.counter + payload;
           return state;
        }
     }
}

export counterStore;
```


**CommentsStore.js** file

```javascript

const commentsStore = {
    name: "comments",
    initState: [],
    operations: {
        comment: (state, comment) => {
          state.comments = [...state.comments, comment];
          return state;
        },
        removeComent: (state, payload) => {
          state.comments = state.comments.filter(comment => comment.id !== payload)
          return state;
        }
     }
     maps: {
       //#1
       comment: (payload) => {
        //Converting simple String for comment reducer, into a msg object to be passed to the
        //comment reducer.
        const id = [...payload].map(c => c.charCodeAt(0) ).join("") + "_" + new Date().getTime();
        return {msg:payload, id, date: new Date() } 
       }
     }
     
}
export commentsStore;
```
Now let's combine them in the **App.js** file

```JSX
import React from "react"; //Not required for React +17
import {render} from "react-dom";
import {StateProvider} from "cabinets-react";
import {counterStore, commentStore } from "./AppStores.js";
import Counter from "./Counter.js";
import Comments from "./Comments.js";

function App(){
  
  return(<>
  /*#1*/
   <StateProvider stores={[counterStore, commentStore]} combine={true} combineName="appStore" />
   <CounterMessage />
   <Counter />
   <Comments />
   
  </>);
}

render(<App />, document.querySelector("#react-root") );

```
Now, **CounterMessage,Counter and Comments**  needs to be updated
so they access to their specific substore and in this case
that those stores are not very much related we want to keep
subscription separated from each other, meaning, one change on counter
does not trigger notifucation for Comments re-rendering. (However, there a times
that this is good)

File **Counter.js**

```JSX
import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "cabinets-react";

export default function Counter(){
    const {fire, actions, getState} = useStoreHook("appStore");
    
    return(<>
      <h3>Current Value: {getState().counter} </h3>
      <button onClick={(e)=>{ fire(actions.increment(1)'; e.preventDefault(); } >Increment by 1</button>
      <button  onClick={(e)=>{ fire(actions.decrement(1)'; e.preventDefault(); } >Decrement by 1</button>
    </>);
}


```


File **CounterMessage.js**

```JSX
import React from "react"; //Not required from React +17
//#1
import {useStoreHook} from "cabinets-react";

export default function CounterMessage(){
    const {getState} = useStoreHook("appStore");
    
    return(<>
    
      {getState().counter > 100 && <h1> We have {getState().counter } clicks we are getting rich </h1>
      
      {getState().counter > 50 &&  getState().counter < 99 && <h1>Keep going, we have only {getState().counter } I want more clicks </h1> }
      
      {getState().counter > 10  &&  getState().counter < 50 && <h1>You just warm up. We have {getState().counter }. Click Please </h1> }
      
      {getState().counter > 1  &&  getState().counter < 10 && <h1>Nice, we have now {getState().counter }. Click! </h1> }
      
      {getState().counter == 0  && <h1>Don't be shy, please click! </h1> }

    </>);
}

```


**Comments.js** file

```JSX
import React,{useState} from "react"; //Not required from React +17
import {useStoreHook} from "cabinets-react";
import Comment from "./Comment.js";

export default function Comments(){
    const {fire, actions,getState} = useStoreHook("appStore");
    const {commentMsg, setCommentMsg} = useState();
    
    
    return(<>
       <h3>Please leave your comment anonymously </h3>
       
       <form onSubmit={()=> fire(actions.comment(commentMsg) } >
         <label htmlFor="comment">Leave a comment</label>
         <input type="text" name="comment" onChange={(e)=> setCommentMsg() } />
         <hr/>
         <submit>Publish</submit>
       </form>
       
       <h2>Comments</h2>
       { getState().comments.map(comment => <Comment comment={comment}
                                    onDelete={ ()=>fire(actions.removeComment(comment.id) ) } />
                       ) 
       }      
    
    </>);
}
```

**Comment.js** file remain same, no changes at all.
```JSX
import React from "react"; //Not required from React +17

export default function Comment(props){
    const {comment} = props;
    
    return(<>
       <div>
         <p>
           {comment.msg}
         </p>
         <i>{comment.date}</i>
         <a onClick={e.preventDefault(); props.onDelete(); }>
          Remove comment
         </a>
       </div>
    </>);
}

```

### Maps: Transforming payload prior to execute reducers
Already we saw how Maps works, [Check here](https://github.com/amasoft-dr/cabinets-react.js/blob/main/README.md#registering-more-than-2-stores)

Only need to be said that you can have a **def** mapper that will
be used for each opearation/action that does not have a map function.
It's like if you defined a **def** mapper it will catch all payload
from all actions prior to be passed to the reducer, so transformation
can be done.


### Interceptors: Executing code after mappings is done an prior reducer is called
Todo...



### Lazy Actions: Modifying your store in an async away
Todo...
