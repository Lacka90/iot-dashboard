const fs = require('fs');

const ENCODING = 'utf-8';

exports.createDatabase = (path) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '[]', ENCODING);
  }

  const readData = () => {
    const data = fs.readFileSync(path, ENCODING);
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch {
      return {};
    }
  };

  const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data), ENCODING);
  };

  return {
    list: () => {
      const data = readData();
      const unsorted = Object.keys(data).reduce((acc, idStr) => {
        const id = parseInt(idStr, 10);
        return [...acc, { id, ...data[id] }];
      }, []);
      const sorted = unsorted.sort((a, b) => a.id - b.id);
      return sorted;
    },
    get: (id) => {
      const data = readData();
      const item = data[id];
      return { id, ...item };
    },
    create: (item) => {
      const data = readData();
      const lastId = Math.max(1, ...Object.keys(data).map((key) => parseInt(key, 10)));
      console.log({ lastId });
      data[lastId + 1] = item;
      writeData(data);
      return {
        id: lastId + 1,
        ...item,
      };
    },
    put: (id, item) => {
      const data = readData();
      data[id] = item;
      writeData(data);
      return {
        id,
        ...item,
      };
    },
    patch: (id, part) => {
      const data = readData();
      data[id] = { ...data[id], ...part };
      writeData(data);
      return {
        id,
        ...data[id],
      };
    },
    remove: (id) => {
      const data = readData();
      delete data[id];
      writeData(data);
      return {
        id,
      };
    },
  };
};