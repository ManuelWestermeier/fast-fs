import WritableSpace from "./src/writable-space.js";

const fsSpace = new WritableSpace("./fs-test-data.bin", 2 ** 20);

fsSpace.close();