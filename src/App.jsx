import { useEffect, useState } from "react";
import HomePage from "./Components/HomePage";
import Dashboard from "./DashPageComp/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./SignUp/Signup";
import Login from "./SignUp/Login";
import CalPlusNav from "./Calendar/CalPlusNav";
import TaskNav from "./Tasks/TaskNav";
import InsightNav from './Insights/InsightNav';
import SettingsNav from "./Settings/SettingsNav";
import Profile from "./Profile/Profile";
import AINav from "./AI/AINav";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      console.log("👍 Install prompt captured");
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
        } else {
          console.log('❌ User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },
    { path: "/calendar", element: <CalPlusNav /> },
    { path: "/tasks", element: <TaskNav /> },
    { path: "/insights", element: <InsightNav /> },
    { path: "/settings", element: <SettingsNav /> },
    { path: "/profile", element: <Profile /> },
    { path: "/ai-suggestions", element: <AINav /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />

      {/* ✅ Install App Button */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000
          }}
        >
          Install App
        </button>
      )}
    </>
  );
}

export default App;
