import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HomeLayout from "./pages/Layouts/HomeLayout";
import Register from "./pages/Register";
import { UserProvider } from "./context/UserContext";
import CreatePost from "./pages/CreatePost";
import IndexPage from "./pages/IndexPage";
import EditPost from "./pages/EditPost";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <UserProvider>
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost/>}></Route>
        <Route path="/post/:id" element={<PostPage/>}></Route>
        <Route path="/edit/:id" element={<EditPost/>}></Route>
      </Route>
    </Routes>
    </UserProvider>

  );
}

export default App;
