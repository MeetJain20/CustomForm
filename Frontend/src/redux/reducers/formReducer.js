const initialState = {
  formtitle: "Untitled Form",
  formdesc: "Form Desc",
  fields: [],
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return {
        ...state,
        formtitle: action.payload,
      };
    case "UPDATE_DESC":
      return {
        ...state,
        formdesc: action.payload,
      };
    case "UPDATE_IMAGE_URL":
      return {
        ...state,
        imageUrl: action.payload, // Update the imageUrl field
      };
    case "ADD_FIELD":
      return {
        ...state,
        fields: [...state.fields, action.payload],
      };
    // Add more cases for other pages if needed
    default:
      return state;
  }
};

export default formReducer;
