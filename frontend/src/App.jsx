import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import AdminRedirect from './components/AdminRedirect';
import CreateChatroom from './components/CreateChatroom';
import UserMenu from "./components/UserMenu";
import Accueil from "./components/Accueil";
import InvitedChatrooms from "./components/InvitedChatrooms";
import MyChatrooms from "./components/MyChatrooms";


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
                    path="/chat/:id"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <Chat />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/createChatroom"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <CreateChatroom />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/userMenu"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <UserMenu />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/accueil"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <Accueil />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/invitedChatrooms"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <InvitedChatrooms />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/myChatrooms"
                    element={
                        <PrivateRoute requireAdmin={false}>
                            <MyChatrooms />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
