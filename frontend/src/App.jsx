import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategory from "./pages/AddCategory";
import ManageCategory from "./pages/ManageCategory";
import AddAuthor from "./pages/AddAuthor";
import ManageAuthor from './pages/ManageAuthor';
import AddBook from './pages/AddBook';
import ManageBook from "./pages/ManageBook";
import AdminChangePassword from "./pages/AdminChangePassword";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import StudentDashboard from "./pages/StudentDashboard";
import MyLibrary from "./pages/MyLibrary";
import UserProfile from "./pages/UserProfile";
import UserChangePassword from "./pages/UserChangePassword";
import ManageStudents from "./pages/ManageStudents";
import IssueBook from "./pages/IssueBook";
import ManageIssuedBooks from "./pages/ManageIssuedBooks";
import IssuedBookDetails from "./pages/IssuedBookDetails";
import StudentHistory from "./pages/StudentHistory";
import StudentIssuedBooks from "./pages/StudentIssuedBooks";

function App() {
  return (
    <>
      <Header />

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/category-add" element={<AddCategory />} />
        <Route path="/admin/category-manage" element={<ManageCategory />} />

        <Route path="/admin/author-add" element={<AddAuthor />} />
        <Route path="/admin/author-manage" element={<ManageAuthor />} />

        <Route path="/admin/book-add" element={<AddBook />} />
        <Route path="/admin/book-manage" element={<ManageBook />} />

        <Route path="/admin/change-password" element={<AdminChangePassword />} />
        


        <Route path="/admin/students" element={<ManageStudents />} />

        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<StudentDashboard />} />
        <Route path="/user/my-library" element={<MyLibrary />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/change-password" element={<UserChangePassword />} />
        <Route path="/admin/issue-book" element={<IssueBook />} />
        <Route path="/admin/manage-issued-books" element={<ManageIssuedBooks />} />
        <Route path="/admin/issued-book/:id" element={<IssuedBookDetails />} />
        <Route path="/admin/student-history/:id" element={<StudentHistory />} />
        <Route path="/user/issued-books" element={<StudentIssuedBooks />} />

      </Routes>


    </>
  );
}

export default App;