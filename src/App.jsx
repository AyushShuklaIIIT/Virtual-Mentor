import HomePage from "./Components/HomePage"
import Dashboard from "./DashPageComp/Dashboard"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./SignUp/Signup"
import Login from "./SignUp/Login"
import CalPlusNav from "./Calendar/CalPlusNav"
import TaskNav from "./Tasks/TaskNav"
import InsightNav from './Insights/InsightNav'
import SettingsNav from "./Settings/SettingsNav"
import Profile from "./Profile/Profile"
import Team from "./TeamManagement/Team"
import AINav from "./AI/AINav"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <>
        <HomePage></HomePage>
        {/* <Team></Team> */}
      </>
    },
    {
      path: "/dashboard",
      element: <>
        <Dashboard></Dashboard>
      </>
    },
    {
      path: "/signup",
      element: <>
        <Signup></Signup>
      </>
    },
    {
      path: "/login",
      element: <><Login></Login></>
    },
    {
      path: '/calendar',
      element: <>
      <CalPlusNav></CalPlusNav>
      </>
    },
    {
      path: '/tasks',
      element: <><TaskNav></TaskNav></>
    },
    {
      path: '/insights',
      element: <><InsightNav></InsightNav></>
    },
    {
      path: '/settings',
      element: <><SettingsNav></SettingsNav></>
    },
    {
      path: '/profile',
      element: <><Profile></Profile></>
    },
    {
      path: '/ai-suggestions',
      element: <><AINav></AINav></>
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
