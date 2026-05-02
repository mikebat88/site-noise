import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Music from "./pages/Music";
import Contact from "./pages/Contact";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ManageAlbums from './pages/ManageAlbums';
import EditShows from './pages/EditShows';
import EditLatest from './pages/EditLatest';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from "./components/ProtectedRoute";
import AddAlbum from "./pages/AddAlbum";
import EditAlbum from "./pages/EditAlbum";


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* LOGIN PAGE (No Layout) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
            <Route path="/admin/albums-edit" element={<ProtectedRoute> <ManageAlbums /> </ProtectedRoute>} />
            <Route path="/admin/latest-edit" element={<ProtectedRoute> <EditLatest /> </ProtectedRoute>} />
            <Route path="/admin/shows-edit" element={<ProtectedRoute> <EditShows /> </ProtectedRoute>} />
            <Route path="/admin/change-password" element={<ProtectedRoute> <ChangePassword /> </ProtectedRoute>} />
            <Route path="/admin/add-album" element={<ProtectedRoute> <AddAlbum /> </ProtectedRoute>} />
            <Route path="/admin/edit-album/:id" element={<ProtectedRoute> <EditAlbum /> </ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;