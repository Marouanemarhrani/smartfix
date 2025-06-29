import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function TradespersonRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        setLoading(true);
        
        const res = await axios.get(`${process.env.REACT_APP_API || 'http://localhost:8080'}/api/users/tradesperson-auth`);
        
        if (res.data.ok) {
          setOk(true);
        } else {
          throw new Error('Auth check failed');
        }
      } catch (error) {
        console.error("Tradesperson auth check error:", error);
        setOk(false);
        // Clear auth and redirect to login
        localStorage.removeItem("auth");
        setAuth({ user: null, token: "" });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setLoading(false);
      setOk(false);
      navigate("/login");
    }
  }, [auth?.token, setAuth, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return ok ? <Outlet /> : <Spinner />;
} 