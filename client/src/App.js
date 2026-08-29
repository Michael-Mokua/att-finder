import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './theme';
import Navbar from './components/layout/Navbar';
import Alerts from './components/layout/Alerts';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import Opportunities from './components/opportunities/Opportunities';
import Opportunity from './components/opportunities/Opportunity';
import CreateOpportunity from './components/opportunities/CreateOpportunity';
import EditOpportunity from './components/opportunities/EditOpportunity';
import MyApplications from './components/applications/MyApplications';
import CompanyOpportunities from './components/company/CompanyOpportunities';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

// Redux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Fragment>
            <CssBaseline />
            <Navbar />
            <Alerts />
            <div style={{ paddingTop: '64px' }}> {/* Add padding to account for fixed AppBar */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/opportunities/:id" element={<Opportunity />} />
                <Route
                  path="/create-opportunity"
                  element={
                    <PrivateRoute>
                      <CreateOpportunity />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit-opportunity/:id"
                  element={
                    <PrivateRoute>
                      <EditOpportunity />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <PrivateRoute>
                      <MyApplications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/company/opportunities"
                  element={
                    <PrivateRoute>
                      <CompanyOpportunities />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </Fragment>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
