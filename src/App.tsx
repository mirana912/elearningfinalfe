// src/App.tsx
// ==========================================
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "./store/slices/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App mounted");

    const userInfo = localStorage.getItem("userInfo");
    const accessToken = localStorage.getItem("accessToken");

    console.log("Auth check:", {
      hasToken: !!accessToken,
      hasUser: !!userInfo,
    });

    if (userInfo && accessToken) {
      dispatch(setUserFromStorage());
      console.log("✅ User loaded from storage");
    }
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
