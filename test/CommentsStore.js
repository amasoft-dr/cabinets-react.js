const commentsStore = {
    name: "comments",
    initState: [],
    operations: {
        comment: (state, comment) => {
          state.comments = [...state.comments, comment];
          return {...state};
        },
        removeComent: (state, id) => {
          state.comments = state.comments.filter(comment => comment.id !== id)
          return {...state};
        }
     },
     maps: {
       //#1
       comment: (state, payload) => {
        //Converting simple String for comment reducer, into a comment object to be passed to the
        //comment reducer.
        const id = [...payload].map(c => c.charCodeAt(0) ).join("") + "_" + new Date().getTime();
        return {msg:payload, id, date: new Date() } 
       }
     }
     
}

const commentsStore2 = {
    name: "commentStore",
    initState: [],
    operations: {
        comment: (state, comment) =>  [...state, comment],
        removeComent: (state, id) => state.filter(comment => comment.id !== id)
     },
     maps: {
       //#1
        comment: (state, payload) => {
        //Converting simple String for comment reducer, into a msg object to be passed to the
        //comment reducer.
        const id = [...payload].map(c => c.charCodeAt(0) ).join("") + "_" + new Date().getTime();
        return {msg:payload, id, date: new Date() } 
       }
     }
     
}
export {commentsStore, commentsStore2};