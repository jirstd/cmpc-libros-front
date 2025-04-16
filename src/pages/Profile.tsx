import { Container, Typography, Card, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Typography variant="h6">Cargando...</Typography>;

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ maxWidth: 400, margin: "auto", textAlign: "center", p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Perfil de Usuario</Typography>
          <Typography variant="body1"><strong>Nombre:</strong> {user.nombre}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
