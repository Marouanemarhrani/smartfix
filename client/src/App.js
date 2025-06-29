import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Termsofservice from "./pages/Termsofservice";
import Register from "./pages/Auth/Register";
import RegisterTradesperson from "./pages/Auth/RegisterTradesperson";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/AdminRoute";
import TradespersonRoute from "./components/Routes/TradespersonRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRepairs from "./pages/admin/AdminRepairs";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTradespeople from "./pages/admin/AdminTradespeople";
import Profile from "./pages/user/Profile";
import CreateRepair from "./pages/user/CreateRepair";
import MyRepairs from "./pages/user/MyRepairs";
import RepairDetails from "./pages/RepairDetails";
import TradespersonDashboard from "./pages/tradesperson/TradespersonDashboard";
import TradespersonProfile from "./pages/tradesperson/TradespersonProfile";
import MyQuotes from "./pages/tradesperson/MyQuotes";
import CreateQuote from "./pages/tradesperson/CreateQuote";
import ChatPage from "./pages/ChatPage";
import MyChats from "./pages/MyChats";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/repair/:id" element={<RepairDetails />} />
          <Route path="/chats" element={<MyChats />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="user/create-repair" element={<CreateRepair />} />
            <Route path="user/my-repairs" element={<MyRepairs />} />
          </Route>
          
          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/repairs" element={<AdminRepairs />} />
            <Route path="admin/quotes" element={<AdminQuotes />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/tradespeople" element={<AdminTradespeople />} />
          </Route>

          <Route path="/dashboard" element={<TradespersonRoute />}>
            <Route path="tradesperson" element={<TradespersonDashboard />} />
            <Route path="tradesperson/profile" element={<TradespersonProfile />} />
            <Route path="tradesperson/my-quotes" element={<MyQuotes />} />
            <Route path="tradesperson/create-quote/:repairId" element={<CreateQuote />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/register-tradesperson" element={<RegisterTradesperson />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<Policy />} />
          <Route path="/terms-of-service" element={<Termsofservice />} />
          <Route path="/*" element={<Pagenotfound />} />
        </Routes>
    </>
  );
}

export default App;
