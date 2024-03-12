const initialState = {
  copyField: false,
  deleteField: false,
  saveChanges: false,
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
    default:
      return state;
  }
};

export default functionalityReducer;
