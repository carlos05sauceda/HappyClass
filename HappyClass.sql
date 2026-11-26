CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'docente', 'estudiante') NOT NULL DEFAULT 'estudiante',
  nombre_completo VARCHAR(150) NOT NULL,
  codigo_identificacion VARCHAR(50) UNIQUE, -- Carnet de estudiante o código de empleado
  departamento VARCHAR(120),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO usuarios (
  correo,
  contrasena_hash,
  rol,
  nombre_completo,
  codigo_identificacion,
  departamento,
  activo
) VALUES (
  'admin@universidad.edu',
  '$2b$10$bHVU11nrMfhPoaGma.5mDeE8DVub8AB/C9nztROkQj3W9P4mZO3Fi',
  'admin',
  'Administrador Principal',
  'ADM-001',
  'Administración',
  TRUE
);

select * from usuarios