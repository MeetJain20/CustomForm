import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./reducers/searchReducer";
import formReducer from "./reducers/formReducer";

const store = configureStore({
    reducer:{
        searchtext: searchReducer,
        formData: formReducer
    }
})

export default store;