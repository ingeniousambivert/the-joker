const sanitizeString = (string) => {
  return string.replace(/\s/g, "").toLowerCase();
};

const storage = {
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export { sanitizeString, storage };
