import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/Authentication";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import AdminRedirect from "./components/AdminRedirect";
import CreateChatroom from "./components/CreateChatroom";
import UserMenu from "./components/UserMenu";
import Accueil from "./components/Accueil";
import InvitedChatrooms from "./components/InvitedChatrooms";
import MyChatrooms from "./components/MyChatrooms";
import EditChatroom from "./components/EditChatroom";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

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
                            <PrivateRoute>
                                <Chat />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/createChatroom"
                        element={
                            <PrivateRoute>
                                <CreateChatroom />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/userMenu"
                        element={
                            <PrivateRoute>
                                <UserMenu />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/accueil"
                        element={
                            <PrivateRoute>
                                <Accueil />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/invitedChatrooms"
                        element={
                            <PrivateRoute>
                                <InvitedChatrooms />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/myChatrooms"
                        element={
                            <PrivateRoute>
                                <MyChatrooms />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/editChatroom/:id"
                        element={
                            <PrivateRoute>
                                <EditChatroom />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
