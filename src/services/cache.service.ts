import NodeCache from "node-cache";

const cache = new NodeCache();

const setItem = (key: string, value: any, expiryTime?: number) => {
  return cache.set(key, value, expiryTime ? expiryTime : "");
};

const getItem = (key: string) => {
  const value = cache.get(key);
  return value ? value : null;
};

const removeItem = (key: string) => {
  return cache.del(key);
};

export { setItem, getItem, removeItem };
