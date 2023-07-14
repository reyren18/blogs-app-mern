import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);


  useEffect(()=>{
    fetch('http://localhost:4000/profile', {
      credentials: "include",
    }).then(response => {
      response.json().then(userInfo=>{
-       setUserInfo(userInfo)
      })
    })
  },[])

  const handleLogout = () => {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUserInfo(null);
      })
      .catch((error) => console.log("Error logging out:", error));
  };

  const username = userInfo?.username;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          My Blog
        </Link>
        <nav>
          {username ? (
            <>
              <Link className="nav-link" to={"/create"}>
                Create Post
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
