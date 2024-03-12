const initialState = {
  fields: [],
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_FIELDS_FROM_BACKEND":
      return {
        ...state,
        fields: action.payload, // Update fields array with data received from backend
      };
    case "ADD_FIELD":
      return {
        ...state,
        fields: [
          ...state.fields,
          { fieldid: action.payload.id, type: action.payload.type },
        ],
      };
    case "UPDATE_FIELD_TYPE":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.fieldid === action.payload.fieldId
            ? { ...field, type: action.payload.type }
            : field
        ),
      };
    case "DELETE_FIELD_ARRAY":
      return {
        ...state,
        fields: state.fields.filter(
          (field) => field.fieldid !== action.payload.fieldId
        ),
      };
    default:
      return state;
  }
};

export default formReducer;
