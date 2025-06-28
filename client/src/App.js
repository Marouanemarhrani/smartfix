import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import NewProblem from './components/problems/NewProblem';
import ProblemDetail from './components/problems/ProblemDetail';
import NewQuote from './components/quotes/NewQuote';
import ConversationList from './components/messages/ConversationList';
import MessageList from './components/messages/MessageList';
import NewAppointment from './components/appointments/NewAppointment';
import AppointmentList from './components/appointments/AppointmentList';

// Composant de protection des routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-problem" element={<NewProblem />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/problems/:problemId/new-quote" element={<NewQuote />} />
        <Route path="/messages" element={<ConversationList />} />
        <Route path="/problems/:problemId/messages" element={<MessageList />} />
        <Route path="/problems/:problemId/new-appointment" element={<NewAppointment />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
