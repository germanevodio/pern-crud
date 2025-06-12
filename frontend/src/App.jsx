import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Login from './pages/Login';
import ProtectedRoute from './components/protectedRoute';
import UsersList from './pages/users/UsersList';
import AddUser from './pages/users/AddUser';
import User from './pages/users/User';
import { AlertProvider } from './context/alertContext';

function Navbar() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="flex justify-between items-center container mx-auto">
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/users" className="hover:text-gray-300 font-bold">
                Users list
              </Link>
              { isAdmin && (
                <Link to="/add" className="hover:text-gray-300">
                  Add user
                </Link>
              )}
              <button onClick={logout} className="h-8 py-1 text-sm bg-blue-400 hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300 font-bold">
              Singin
            </Link>
          )}
        </div>
        {isAuthenticated && (
          <span className="text-white">Welcome: {user?.email || ""}</span>
        )}
      </div>
    </nav>
  );
}


function App() {

  return (
    <AuthProvider>
      <AlertProvider>
        < BrowserRouter >
          <div>
            <Navbar />

            {/* ROUTES */}
            <div className="container mx-auto mt-8 px-4">
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute />}>
                  <Route index element={<UsersList />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/users" element={<UsersList />} />
                  <Route path="/add" element={<AddUser />} />
                  <Route path="/users/:id" element={<User />} />
                </Route>
              </Routes>
            </div>
          </div>
        </BrowserRouter >
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;