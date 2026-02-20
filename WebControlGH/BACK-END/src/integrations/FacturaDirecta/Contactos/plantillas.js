// ----------- EJEMPLOS  ----------- \\

// 1. Ejemplo de un cliente español (empresa)

const cliente = {
  content: {
    type: "contact",
    main: {
      name: "Empresa de prueba",
      fiscalId: "B12345674",
      currency: "EUR",
      email: "empresa@prueba.com",
      phone: "000-000-0002",
      country: "ES",
      address: "Pza Mayor, 4",
      zipcode: "49004",
      city: "Zamora",
      region: "Zamora",
      accounts: {
        client: "430000",
      },
      persons: [
        {
          id: 100,
          name: "Pepe Pérez",
        },
      ],
    },
  },
};

// 2. Ejemplo de un proveedor español (empresa)

const proveedor = {
  content: {
    type: "contact",
    main: {
      name: "Proveedor de prueba",
      fiscalId: "B12345674",
      currency: "EUR",
      email: "proveedor@prueba.com",
      phone: "000-000-0001",
      country: "ES",
      address: "Pza Mayor, 4",
      zipcode: "49004",
      city: "Zamora",
      region: "Zamora",
      providerCode: "41070",
      accounts: {
        provider: "400000",
      },
      persons: [
        {
          id: 100,
          name: "Pepe Pérez",
        },
      ],
    },
  },
};
