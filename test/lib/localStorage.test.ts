import { LocalStorage } from "node-localstorage";
import {
  LOCAL_STORAGE_KEY,
  readExpanded,
  writeExpanded,
} from "../../src/lib/localStorage";

describe("localStorage", () => {
  const TEST_NAME = "test_name";

  let storage: LocalStorage;

  beforeAll(() => {
    storage = new LocalStorage("./scratch");
    globalThis.localStorage = storage;

    storage.removeItem(LOCAL_STORAGE_KEY);
  });

  afterAll(() => {
    (storage as any)._deleteLocation();
  });

  afterEach(() => {
    storage.removeItem(LOCAL_STORAGE_KEY);
  });

  it("should expect a node to not be expanded by default", () => {
    expect(readExpanded(TEST_NAME)).toBe(false);
  });

  it("should write a node is expanded", () => {
    writeExpanded(TEST_NAME, false);
    writeExpanded(TEST_NAME, true);
    expect(readExpanded(TEST_NAME)).toBe(true);
  });

  it("should write a node as collapsed", () => {
    writeExpanded(TEST_NAME, true);
    writeExpanded(TEST_NAME, false);
    expect(readExpanded(TEST_NAME)).toBe(false);
  });
});
