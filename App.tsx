import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PantallaInicioSesion, {
  RespuestaInicioSesion,
  Usuario,
} from './components/Login';
import PantallaCrearUsuario from './components/CrearUsuario'; // Ajusta la carpeta si está en otra ruta

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const manejarSesionIniciada = (datos: RespuestaInicioSesion): void => {
    setToken(datos.token);
    setUsuario(datos.usuario);
  };

  const cerrarSesion = (): void => {
    setToken(null);
    setUsuario(null);
  };

  if (!token || !usuario) {
    return <PantallaInicioSesion alIniciarSesion={manejarSesionIniciada} />;
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.bienvenida}>Bienvenido, {usuario.nombre_completo}</Text>
      <Text style={estilos.rol}>Perfil activo: {usuario.rol}</Text>

      {usuario.rol === 'admin' && (
        <View style={estilos.tarjetaRol}>
          <Text style={estilos.tituloTarjeta}>Panel de Administrador</Text>
          <Text>Aquí iría la vista para crear docentes, estudiantes o administradores.</Text>
          <PantallaCrearUsuario token={token} />
        </View>
        
      )}

      {usuario.rol === 'docente' && (
        <View style={estilos.tarjetaRol}>
          <Text style={estilos.tituloTarjeta}>Panel de Docente</Text>
          <Text>Aquí irían tus cursos y calificaciones.</Text>
        </View>
      )}

      {usuario.rol === 'estudiante' && (
        <View style={estilos.tarjetaRol}>
          <Text style={estilos.tituloTarjeta}>Panel de Estudiante</Text>
          <Text>Carnet: {usuario.codigo_identificacion ?? 'Sin asignar'}</Text>
        </View>
      )}

      <TouchableOpacity style={estilos.botonSalir} onPress={cerrarSesion}>
        <Text style={estilos.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  bienvenida: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  rol: { fontSize: 15, color: '#475569', marginBottom: 20 },
  tarjetaRol: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  tituloTarjeta: { fontSize: 17, fontWeight: '600', marginBottom: 6, color: '#0f172a' },
  botonSalir: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: '600' },
});