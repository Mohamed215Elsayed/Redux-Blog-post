// import { 
//     createSlice,
//     // nanoid,
//     createAsyncThunk,
//     createEntityAdapter,//
//     createSelector,//
//  } from "@reduxjs/toolkit";
// import { sub } from 'date-fns';
// import axios from "axios";

// const postsAdapter = createEntityAdapter({
//     sortComparer: (a, b) => b.date.localeCompare(a.date)
// });

// const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// const initialState = {
//     // posts: [],
//     status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//     count: 0
// }

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
//     const response = await axios.get(POSTS_URL)
//     return response.data
// })

// export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
//     const response = await axios.post(POSTS_URL, initialPost)
//     return response.data
// })

// export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
//     const { id } = initialPost;
//     // try-catch block only for development/testing with fake API
//     // otherwise, remove try-catch and add updatePost.rejected case
//     try {
//         const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
//         return response.data
//     } catch (err) {
//         // return err.message;
//         return initialPost; // only for testing Redux!
//     }
// })

// export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
//     const { id } = initialPost;
//     try {
//         const response = await axios.delete(`${POSTS_URL}/${id}`)
//         if (response?.status === 200) return initialPost;
//         return `${response?.status}: ${response?.statusText}`;
//     } catch (err) {
//         return err.message;
//     }
// })

// const postsSlice = createSlice({
//     name: 'posts',
//     initialState,
//     reducers: {
//         // postAdded: {
//         //     reducer(state, action) {
//         //         state.posts.push(action.payload)
//         //     },
//         //     prepare(title, content, userId) {
//         //         return {
//         //             payload: {
//         //                 id: nanoid(),
//         //                 title,
//         //                 content,
//         //                 date: new Date().toISOString(),
//         //                 userId,
//         //                 reactions: {
//         //                     thumbsUp: 0,
//         //                     wow: 0,
//         //                     heart: 0,
//         //                     rocket: 0,
//         //                     coffee: 0
//         //                 }
//         //             }
//         //         }
//         //     }
//         // },
//         reactionAdded(state, action) {
//             const { postId, reaction } = action.payload;
//             // const existingPost = state.posts.find(post => post.id === postId);
//             const existingPost = state.entities[postId];//
//             if (existingPost) {
//                 existingPost.reactions[reaction]++; // increment
//             }
//         },
//         increaseCount(state, action) {
//             state.count = state.count + 1;
//         }
//     },
//     extraReducers(builder) {
//         builder
//             .addCase(fetchPosts.pending, (state, action) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchPosts.fulfilled, (state, action) => {
//                 state.status = 'succeeded'
//                 // Adding date and reactions
//                 let min = 1;
//                 const loadedPosts = action.payload.map(post => {
//                     post.date = sub(new Date(), { minutes: min++ }).toISOString();
//                     post.reactions = {
//                         thumbsUp: 0,
//                         wow: 0,
//                         heart: 0,
//                         rocket: 0,
//                         coffee: 0
//                     }
//                     return post;
//                 });
//                 // Add any fetched posts to the array
//                 // state.posts = state.posts.concat(loadedPosts)
//                 postsAdapter.upsertMany(state, loadedPosts);
//             })
//             .addCase(fetchPosts.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             })
//             .addCase(addNewPost.fulfilled, (state, action) => {
//                 // Fix for API post IDs:
//                 // Creating sortedPosts & assigning the id 
//                 // would be not be needed if the fake API 
//                 // returned accurate new post IDs
//                 // const sortedPosts = state.posts.sort((a, b) => {
//                 //     if (a.id > b.id) return 1
//                 //     if (a.id < b.id) return -1
//                 //     return 0
//                 // })
//                 // action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
//                 // End fix for fake API post IDs 

//                 action.payload.id = state.ids[state.ids.length - 1] + 1;//

//                 action.payload.userId = Number(action.payload.userId);
//                 action.payload.date = new Date().toISOString();
//                 action.payload.reactions = {
//                     thumbsUp: 0,
//                     wow: 0,
//                     heart: 0,
//                     rocket: 0,
//                     coffee: 0
//                 }
//                 console.log(action.payload)
//                 // state.posts.push(action.payload)
//                 postsAdapter.addOne(state, action.payload);//add
//             })
//             .addCase(updatePost.fulfilled, (state, action) => {
//                 if (!action.payload?.id) {
//                     console.log('Update could not complete')
//                     console.log(action.payload)
//                     return;
//                 }
//                 // const { id } = action.payload;
//                 action.payload.date = new Date().toISOString();
//                 // const posts = state.posts.filter(post => post.id !== id);
//                 // state.posts = [...posts, action.payload];
//                 postsAdapter.upsertOne(state, action.payload);//update
//             })
//             .addCase(deletePost.fulfilled, (state, action) => {
//                 if (!action.payload?.id) {
//                     console.log('Delete could not complete');
//                     console.log(action.payload);
//                     return;
//                 }
//                 const { id } = action.payload;
//                 // const posts = state.posts.filter(post => post.id !== id);//[except posts with id]
//                 // state.posts = posts;
//                 postsAdapter.removeOne(state, id);
//             })
//     }
// });

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllPosts,
//     selectById: selectPostById,
//     selectIds: selectPostIds
//     // Pass in a selector that returns the posts slice of state
// } = postsAdapter.getSelectors(state => state.posts);

// // export const selectAllPosts = (state) => state.posts.posts;
// export const getPostsStatus = (state) => state.posts.status;
// export const getPostsError = (state) => state.posts.error;
// export const getCount = (state) => state.posts.count;

// // export const selectPostById = (state, postId) =>
// //     state.posts.posts.find(post => post.id === postId);
// export const selectPostsByUser = createSelector(
//     [selectAllPosts, (state, userId) => userId],
//     (posts, userId) => posts.filter(post => post.userId === userId)
// );

// export const { increaseCount, reactionAdded } = postsSlice.actions;// postAdded

// export default postsSlice.reducer;
/**************** */

import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    // try-catch block only for development/testing with fake API
    // otherwise, remove try-catch and add updatePost.rejected case
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;

    const response = await axios.delete(`${POSTS_URL}/${id}`)
    if (response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                postsAdapter.upsertMany(state, loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs

                action.payload.id = state.ids[state.ids.length - 1] + 1
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                action.payload.date = new Date().toISOString();
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                postsAdapter.removeOne(state, id)
            })
    }
})

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)


export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)

export const { increaseCount, reactionAdded } = postsSlice.actions

export default postsSlice.reducer