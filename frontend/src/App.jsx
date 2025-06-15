import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './views/home';
import MainWrapper from './layouts/MainWrapper';
import Login from './views/login';
import PrivateRoute from './layouts/PrivateRoute';
import Logout from './views/logout';
import Private from './views/private';
import Register from './views/register';
import NotesList from './views/notes/NotesList';
import NoteDetail from './views/notes/NoteDetail';

function App() {
    return (
        <BrowserRouter
            future={{
                // Enable React Router v7 features for better performance
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            {/* MainWrapper handles authentication state initialization */}
            <MainWrapper>
                <Routes>
                    {/* Protected route for testing authentication */}
                    <Route
                        path="/private"
                        element={
                            <PrivateRoute>
                                <Private />
                            </PrivateRoute>
                        }
                    />
                    
                    {/* Main notes list page - protected route */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <NotesList />
                            </PrivateRoute>
                        }
                    />
                    
                    {/* Individual note detail page - protected route */}
                    <Route
                        path="/notes/:id"
                        element={
                            <PrivateRoute>
                                <NoteDetail />
                            </PrivateRoute>
                        }
                    />
                    
                    {/* Home page moved to /home for navigation purposes */}
                    <Route path="/home" element={<Home />} />
                    
                    {/* Authentication routes - public access */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App;