-- Migración 001: Añadir columna fd_contact_id a empresas y proveedores
-- Almacena el ID del contacto en FacturaDirecta (formato: "con_<uuid>")
-- para poder hacer PUT en actualizaciones posteriores sin necesidad de buscar por CIF.
-- NULL si el registro no tiene CIF o si la sincronización con FD falló.

ALTER TABLE empresas
  ADD COLUMN fd_contact_id VARCHAR(50) NULL DEFAULT NULL
  COMMENT 'ID del contacto en FacturaDirecta (con_...)';

ALTER TABLE proveedores
  ADD COLUMN fd_contact_id VARCHAR(50) NULL DEFAULT NULL
  COMMENT 'ID del contacto en FacturaDirecta (con_...)';
