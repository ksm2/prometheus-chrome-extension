export const LOCAL_STORAGE_KEY = "prometheus-chrome-extension";

export function readExpanded(name: string): boolean {
  const storage = readStorage();
  return storage.nodes[name]?.expanded ?? false;
}

export function writeExpanded(name: string, value: boolean) {
  const storage = readStorage();

  if (!storage.nodes[name]) {
    storage.nodes[name] = {};
  }

  if (value) {
    storage.nodes[name].expanded = true;
  } else {
    delete storage.nodes[name].expanded;
  }

  if (Object.keys(storage.nodes[name]).length == 0) {
    delete storage.nodes[name];
  }
  writeStorage(storage);
}

function readStorage(): Storage {
  const existingValue = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (existingValue != null) {
    const existing = JSON.parse(existingValue);
    if (typeof existing === "object" && existing.version === "v1") {
      return existing;
    }
  }

  return { version: "v1", nodes: {} };
}

function writeStorage(value: Storage) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
}

interface Storage {
  version: "v1";
  nodes: Record<string, NodeStorage>;
}

interface NodeStorage {
  expanded?: boolean;
}
