import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

const App = () => {
  // const { isLoggedIn } = useAppContext();
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <p>Home Page</p>
              </Layout>
            }
          ></Route>
          <Route
            path="/search"
            element={
              <Layout>
                <p>Search Page</p>
              </Layout>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          ></Route>
          <Route
            path="/sign-in"
            element={
              <Layout>
                <SignIn></SignIn>
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Router>
    </>
  );
};
export default App;
