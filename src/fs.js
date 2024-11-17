import WritableSpace from "./writable-space";

export default class FS {
    constructor(writableSpace = new WritableSpace()) {
        this.writableSpace = writableSpace;
    }

    format() {

    }
}