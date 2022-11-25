import React from "react";
import Cookies from "js-cookie";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuthMe } from "./redux/slices/authSlice";

import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3D405B",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  // {
  //     path: '/questions',
  //     element: <Questions />
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Registration />,
  },
  // {
  //     path: '/reset-password',
  //     element: <ResetPassword />
  // },
  // {
  //     path: '/confirm/:token',
  //     element: <ConfirmEmail />
  // },
  // {
  //     path: '/reset-password/:token',
  //     element: <ChangePassword />
  // },
  // {
  //     path: '/questions/:id',
  //     element: <FullPost />
  // },
  // {
  //     path: '/new-question',
  //     element: <NewQuestion />
  // },
  // {
  //     path: '/profile',
  //     element: <Profile />
  // },
  // {
  //     path: '/users/:id',
  //     element: <UserPage />
  // },
  // {
  //     path: '/questions/:id/edit',
  //     element: <NewQuestion />
  // },
  // {
  //     path: '/notes',
  //     element: <Notes />
  // }
]);

const userToken = Cookies.get("token") ? Cookies.get("token") : null;

function App() {
  const dispatch = useDispatch();
  let path = router.state.location.pathname;
  const arr = ["/login", "/signup", "/reset-password"];

  const isAuth = useSelector(selectIsAuthMe);
  console.log("isAuth", isAuth);

  React.useEffect(() => {
    if (userToken) {
      dispatch(fetchAuthMe(userToken));
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {!arr.includes(path) &&
        path.substring(0, 9) != "/confirm/" &&
        path.substring(0, 16) != "/reset-password/" ? (
          <>
            {/* <Header /> */}
            <RouterProvider router={router} />
            {/* <Footer /> */}
          </>
        ) : (
          <RouterProvider router={router} />
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
