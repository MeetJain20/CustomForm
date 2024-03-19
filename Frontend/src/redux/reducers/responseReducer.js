const initialState = {
    fieldResponse: [],
};

const responseReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_RESPONSE":
            const { responseData } = action.payload;
            // console.log(responseData);
            const existingIndex = state.fieldResponse.findIndex(entry => entry.fieldid === responseData.fieldid);

            if (existingIndex !== -1) {
                // Field ID already exists, update response
                const updatedFieldResponse = [...state.fieldResponse];
                updatedFieldResponse[existingIndex] = { ...updatedFieldResponse[existingIndex], response: responseData.response };
                return {
                    ...state,
                    fieldResponse: updatedFieldResponse
                };
            } else {
                // Field ID doesn't exist, add new entry
                return {
                    ...state,
                    fieldResponse: [
                        ...state.fieldResponse,
                        {
                            fieldid: responseData.fieldid,
                            question: responseData.question,
                            response: responseData.response
                        }
                    ]
                };
            }
            
        default:
            return state;
    }
};

export default responseReducer;
