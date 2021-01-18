export const DBConfig = {
  name: "BookStore",
  version: 1,
  objectStoresMeta: [
    {
      store: "cart",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "bookID", keypath: "bookID", options: { unique: false } },
        { name: "title", keypath: "title", options: { unique: false } },
        { name: "price", keypath: "price", options: { unique: false } },
        { name: "rating", keypath: "rating", options: { unique: false } },
      ],
    },
  ],
};
