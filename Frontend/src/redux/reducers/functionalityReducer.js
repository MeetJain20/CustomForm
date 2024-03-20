const initialState = {
  copyField: false,
  deleteField: false,
  saveChanges: false,
  deleteform:false
};

const functionalityReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COPY_FIELD':
      return {
        ...state,
        copyField: !state.copyField,
      };
    case 'DELETE_FIELD':
      return {
        ...state,
        deleteField: !state.deleteField,
      };
    case 'SAVE_FIELD':
      return {
        ...state,
        saveChanges: !state.saveChanges,
      };
    case 'DELETE_FORM':
      return {
        ...state,
        deleteform: !state.deleteform,
      };
    default:
      return state;
  }
};

export default functionalityReducer;
