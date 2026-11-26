import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

export type RolUsuario = 'admin' | 'docente' | 'estudiante';

export interface Usuario {
  id: number;
  correo: string;
  rol: RolUsuario;
  nombre_completo: string;
  codigo_identificacion: string | null;
  departamento: string | null;
  activo: boolean;
}

export interface RespuestaInicioSesion {
  token: string;
  usuario: Usuario;
}

interface PropiedadesPantallaInicioSesion {
  alIniciarSesion: (datos: RespuestaInicioSesion) => void;
}

const URL_API = 'http://192.168.1.2:3000/api';

export default function PantallaInicioSesion({
  alIniciarSesion,
}: PropiedadesPantallaInicioSesion) {
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarInicioSesion = async (): Promise<void> => {
    if (!correo.trim() || !contrasena) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo institucional y contraseña.');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${URL_API}/autenticacion/iniciar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) {
        Alert.alert('Error de inicio de sesión', datos.mensaje || 'Credenciales incorrectas');
        return;
      }

      alIniciarSesion(datos as RespuestaInicioSesion);
    } catch {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Portal Universitario</Text>
      <Text style={estilos.subtitulo}>Inicia sesión con tu cuenta asignada</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="Correo institucional"
        autoCapitalize="none"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <TouchableOpacity style={estilos.boton} onPress={manejarInicioSesion} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBoton}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  titulo: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#475569', marginBottom: 24 },
  entrada: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#1d4ed8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: '600' },
});