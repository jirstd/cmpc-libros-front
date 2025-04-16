import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Container>
  );
};

export default Dashboard;