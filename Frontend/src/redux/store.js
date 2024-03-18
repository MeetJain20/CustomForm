import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./reducers/searchReducer";
import formReducer from "./reducers/formReducer";
import responseReducer from "./reducers/responseReducer";
import functionalityReducer from "./reducers/functionalityReducer";

const store = configureStore({
    reducer:{
        searchtext: searchReducer,
        formData: formReducer,
        funcfield: functionalityReducer,
        response: responseReducer
    }
})

export default store;