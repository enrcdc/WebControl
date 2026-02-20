/**
 * Mapeo de entidades ERP → payload de Contacto para la API de FacturaDirecta.
 *
 * Campos hardcoded por política de empresa:
 *   country  = "ES"   (empresa española)
 *   currency = "EUR"
 *   accounts.client   = "430000"  (PGC España — clientes)
 *   accounts.provider = "400000"  (PGC España — proveedores)
 */

/**
 * Mapea una empresa ERP a un contacto cliente de FacturaDirecta.
 *
 * @param {Object} empresaData  - Datos camelCase del formulario (nombre, cif, email, …)
 * @param {Array}  contactos    - Contactos de la empresa [{id, nombre_contacto|nombre, apellido1}]
 * @returns {Object}            Payload listo para POST/PUT /contacts
 */
export function mapEmpresaToFD(empresaData, contactos = []) {
  const main = {
    name: empresaData.nombre,
    country: "ES",
    currency: "EUR",
    accounts: { client: "430000" },
  };

  if (empresaData.cif) main.fiscalId = empresaData.cif;
  if (empresaData.email) main.email = empresaData.email;
  if (empresaData.telefono1) main.phone = empresaData.telefono1;
  if (empresaData.direccion) main.address = empresaData.direccion;
  if (empresaData.cp) main.zipcode = empresaData.cp;
  if (empresaData.poblacion) main.city = empresaData.poblacion;
  if (empresaData.provincia) main.region = empresaData.provincia;

  if (contactos.length > 0) {
    main.persons = contactos.map((c) => ({
      // Usar el id del contacto en la DB (campo puede llamarse id o id_contacto)
      id: c.id ?? c.id_contacto,
      name: [c.nombre_contacto ?? c.nombre, c.apellido1]
        .filter(Boolean)
        .join(" "),
    }));
  }

  return { content: { type: "contact", main } };
}

/**
 * Mapea un proveedor ERP a un contacto proveedor de FacturaDirecta.
 *
 * @param {Object} proveedorData - Datos camelCase del formulario (nombre, cif, contacto, codigo, …)
 * @param {number} entityId      - ID del proveedor en la DB (usado como id de la persona de contacto)
 * @returns {Object}             Payload listo para POST/PUT /contacts
 */
export function mapProveedorToFD(proveedorData, entityId) {
  const main = {
    name: proveedorData.nombre,
    country: "ES",
    currency: "EUR",
    accounts: { provider: "400000" },
  };

  if (proveedorData.cif) main.fiscalId = proveedorData.cif;
  if (proveedorData.email) main.email = proveedorData.email;
  if (proveedorData.telefono1) main.phone = proveedorData.telefono1;
  if (proveedorData.direccion) main.address = proveedorData.direccion;
  if (proveedorData.cp) main.zipcode = proveedorData.cp;
  if (proveedorData.poblacion) main.city = proveedorData.poblacion;
  if (proveedorData.provincia) main.region = proveedorData.provincia;
  // Código del proveedor en el ERP → providerCode en FD
  if (proveedorData.codigo) main.providerCode = String(proveedorData.codigo);

  // PersonaContacto (texto libre) → persons con id del proveedor como identificador
  if (proveedorData.contacto) {
    main.persons = [{ id: entityId, name: proveedorData.contacto }];
  }

  return { content: { type: "contact", main } };
}
