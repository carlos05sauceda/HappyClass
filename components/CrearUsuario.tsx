import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { RolUsuario } from './Login';

interface PropiedadesPantallaCrearUsuario {
  token: string;
  alUsuarioCreado?: () => void;
}

const URL_API = 'http://192.168.1.2:3000/api';
const ROLES: RolUsuario[] = ['estudiante', 'docente', 'admin'];

export default function PantallaCrearUsuario({
  token,
  alUsuarioCreado,
}: PropiedadesPantallaCrearUsuario) {
  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [rol, setRol] = useState<RolUsuario>('estudiante');
  const [codigoIdentificacion, setCodigoIdentificacion] = useState<string>('');
  const [departamento, setDepartamento] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const limpiarFormulario = (): void => {
    setNombreCompleto('');
    setCorreo('');
    setContrasena('');
    setRol('estudiante');
    setCodigoIdentificacion('');
    setDepartamento('');
  };

  const manejarCrearUsuario = async (): Promise<void> => {
    if (!nombreCompleto.trim() || !correo.trim() || !contrasena) {
      Alert.alert(
        'Campos obligatorios',
        'Completa nombre completo, correo institucional y contraseña.'
      );
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${URL_API}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_completo: nombreCompleto.trim(),
          correo: correo.trim().toLowerCase(),
          contrasena,
          rol,
          codigo_identificacion: codigoIdentificacion.trim() || null,
          departamento: departamento.trim() || null,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert(
          'No se pudo crear el usuario',
          datos.mensaje || 'Verifica los datos o los permisos del administrador.'
        );
        return;
      }

      Alert.alert(
        'Usuario creado',
        `Se registró a ${datos.nombre_completo} con el rol de ${datos.rol}.`
      );
      limpiarFormulario();
      alUsuarioCreado?.();
    } catch {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenedor} keyboardShouldPersistTaps="handled">
      <Text style={estilos.titulo}>Crear nuevo usuario</Text>
      <Text style={estilos.subtitulo}>
        Asigna un perfil de estudiante, docente o administrador
      </Text>

      <Text style={estilos.etiqueta}>Nombre completo *</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ej. María Fernanda López"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />

      <Text style={estilos.etiqueta}>Correo institucional *</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ej. maria.lopez@universidad.edu"
        autoCapitalize="none"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={estilos.etiqueta}>Contraseña temporal *</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Text style={estilos.etiqueta}>Rol del usuario *</Text>
      <View style={estilos.filaRoles}>
        {ROLES.map((opcionRol) => {
          const seleccionado = rol === opcionRol;
          return (
            <TouchableOpacity
              key={opcionRol}
              style={[
                estilos.botonRol,
                seleccionado && estilos.botonRolSeleccionado,
              ]}
              onPress={() => setRol(opcionRol)}
            >
              <Text
                style={[
                  estilos.textoRol,
                  seleccionado && estilos.textoRolSeleccionado,
                ]}
              >
                {opcionRol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={estilos.etiqueta}>Código de identificación (carnet o empleado)</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ej. 20261001 o DOC-012"
        value={codigoIdentificacion}
        onChangeText={setCodigoIdentificacion}
      />

      <Text style={estilos.etiqueta}>Departamento o carrera</Text>
      <TextInput
        style={estilos.entrada}
        placeholder="Ej. Ingeniería en Sistemas"
        value={departamento}
        onChangeText={setDepartamento}
      />

      <TouchableOpacity
        style={estilos.botonGuardar}
        onPress={manejarCrearUsuario}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBoton}>Guardar usuario</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  entrada: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
    fontSize: 15,
  },
  filaRoles: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  botonRol: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  botonRolSeleccionado: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  textoRol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textTransform: 'capitalize',
  },
  textoRolSeleccionado: {
    color: '#fff',
  },
  botonGuardar: {
    backgroundColor: '#15803d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});