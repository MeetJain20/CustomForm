import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./reducers/searchReducer";
import formReducer from "./reducers/formReducer";
import functionalityReducer from "./reducers/functionalityReducer";

const store = configureStore({
    reducer:{
        searchtext: searchReducer,
        formData: formReducer,
        funcfield: functionalityReducer
    }
})

export default store;