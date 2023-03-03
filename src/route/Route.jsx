import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IncludeNav from "../components/Others/IncludeNav";
import ProtectedLogin from "../components/Protected/ProtectedLogin";
import ProtectedUser from "../components/Protected/ProtectedUser";
import Activities from "../pages/Activities/Pages";
import Data from "../pages/Data/Index";
import Home from "../pages/Home";
import ResetPassword from "../pages/Login/ResetPassword";
import SignUp from "../pages/Login/SignUp";
import Members from "../pages/Members/Pages/Index";
import Payments from "../pages/Payment";
import User from "../pages/User/User";

export default function RouteApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          index
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Home />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Home />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="/users/"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <User />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="/data/"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Data />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="/members/"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Members />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="/payments/"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Payments />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route
          path="/activities/"
          element={
            <ProtectedLogin>
              <ProtectedUser>
                <IncludeNav>
                  <Activities />
                </IncludeNav>
              </ProtectedUser>
            </ProtectedLogin>
          }
        />
        <Route path="/create-account-in-acropolis/" element={<SignUp />} />
        <Route path="/reset-password/" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
