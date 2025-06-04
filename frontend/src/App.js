import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Chat from './components/Chat';
import AdminRedirect from './components/AdminRedirect';
import Home from './components/Home';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute requireAdmin={true}>
                            <AdminRedirect />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
