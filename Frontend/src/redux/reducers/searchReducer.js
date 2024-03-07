const initialState = {
    searchText: "",
  };
  
  const searchReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEARCH_TEXT':
        return {
          ...state,
          searchText: action.payload,
        };
      // Add more cases for other pages if needed
      default:
        return state;
    }
  };
  
  export default searchReducer;