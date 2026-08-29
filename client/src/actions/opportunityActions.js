import axios from 'axios';
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
} from './types';
import { setAlert } from './alertActions';

// Get all opportunities
export const getOpportunities = (params = {}) => async (dispatch) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const res = await axios.get(`/api/v1/opportunities?${queryString}`);

    dispatch({
      type: GET_OPPORTUNITIES,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: { msg: err.response?.data?.message || 'Error fetching opportunities' },
    });
  }
};

// Get opportunity by ID
export const getOpportunityById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/v1/opportunities/${id}`);

    dispatch({
      type: GET_OPPORTUNITY,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: { msg: err.response?.data?.message || 'Error fetching opportunity' },
    });
  }
};

// Add opportunity
export const addOpportunity = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/v1/opportunities', formData, config);

    dispatch({
      type: ADD_OPPORTUNITY,
      payload: res.data.data,
    });

    dispatch(setAlert('Opportunity created successfully', 'success'));
    history.push('/company/opportunities');
  } catch (err) {
    const errors = err.response?.data?.errors || [];

    if (errors.length > 0) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: { msg: err.response?.data?.message || 'Error creating opportunity' },
    });
  }
};

// Update opportunity
export const updateOpportunity = (id, formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(`/api/v1/opportunities/${id}`, formData, config);

    dispatch({
      type: UPDATE_OPPORTUNITY,
      payload: res.data.data,
    });

    dispatch(setAlert('Opportunity updated successfully', 'success'));
    history.push('/company/opportunities');
  } catch (err) {
    const errors = err.response?.data?.errors || [];

    if (errors.length > 0) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: { msg: err.response?.data?.message || 'Error updating opportunity' },
    });
  }
};

// Delete opportunity
export const deleteOpportunity = (id) => async (dispatch) => {
  if (window.confirm('Are you sure you want to delete this opportunity?')) {
    try {
      await axios.delete(`/api/v1/opportunities/${id}`);

      dispatch({
        type: DELETE_OPPORTUNITY,
        payload: id,
      });

      dispatch(setAlert('Opportunity deleted successfully', 'success'));
    } catch (err) {
      dispatch({
        type: OPPORTUNITY_ERROR,
        payload: { msg: err.response?.data?.message || 'Error deleting opportunity' },
      });
    }
  }
};

// Apply for opportunity
export const applyForOpportunity = (id, formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(
      `/api/v1/opportunities/${id}/apply`,
      formData,
      config
    );

    dispatch({
      type: APPLY_OPPORTUNITY,
      payload: res.data.data,
    });

    dispatch(setAlert('Application submitted successfully', 'success'));
    history.push('/my-applications');
  } catch (err) {
    const errors = err.response?.data?.errors || [];

    if (errors.length > 0) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: { msg: err.response?.data?.message || 'Error submitting application' },
    });
  }
};

// Update application status
export const updateApplicationStatus = (opportunityId, applicationId, status) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.patch(
      `/api/v1/opportunities/${opportunityId}/applications/${applicationId}`,
      { status },
      config
    );

    dispatch({
      type: UPDATE_APPLICATION_STATUS,
      payload: { applicationId, status },
    });

    dispatch(setAlert('Application status updated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: OPPORTUNITY_ERROR,
      payload: {
        msg: err.response?.data?.message || 'Error updating application status',
      },
    });
  }
};

// Clear opportunity
export const clearOpportunity = () => ({
  type: CLEAR_OPPORTUNITY,
});
