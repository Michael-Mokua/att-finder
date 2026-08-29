import {
  GET_OPPORTUNITIES,
  GET_OPPORTUNITY,
  ADD_OPPORTUNITY,
  UPDATE_OPPORTUNITY,
  DELETE_OPPORTUNITY,
  OPPORTUNITY_ERROR,
  CLEAR_OPPORTUNITY,
  APPLY_OPPORTUNITY,
  UPDATE_APPLICATION_STATUS,
} from '../types';

const opportunityReducer = (state, action) => {
  switch (action.type) {
    case GET_OPPORTUNITIES:
      return {
        ...state,
        opportunities: action.payload,
        loading: false,
      };
    case GET_OPPORTUNITY:
      return {
        ...state,
        opportunity: action.payload,
        loading: false,
      };
    case ADD_OPPORTUNITY:
      return {
        ...state,
        opportunities: [action.payload, ...state.opportunities],
        loading: false,
      };
    case UPDATE_OPPORTUNITY:
      return {
        ...state,
        opportunities: state.opportunities.map((opp) =>
          opp._id === action.payload._id ? action.payload : opp
        ),
        loading: false,
      };
    case DELETE_OPPORTUNITY:
      return {
        ...state,
        opportunities: state.opportunities.filter(
          (opp) => opp._id !== action.payload
        ),
        loading: false,
      };
    case APPLY_OPPORTUNITY:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          applications: [
            ...state.opportunity.applications,
            action.payload,
          ],
        },
        loading: false,
      };
    case UPDATE_APPLICATION_STATUS:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          applications: state.opportunity.applications.map((app) =>
            app._id === action.payload.applicationId
              ? { ...app, status: action.payload.status }
              : app
          ),
        },
        loading: false,
      };
    case CLEAR_OPPORTUNITY:
      return {
        ...state,
        opportunity: null,
        loading: false,
      };
    case OPPORTUNITY_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default opportunityReducer;
