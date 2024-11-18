import FSHeader from "./fs-header";
import WritableSpace from "./writable-space";

/*

[
    header: FSHeader,
]

*/

export default class FS {
    constructor(writableSpace = new WritableSpace()) {
        this.writableSpace = writableSpace;
        this.header = new FSHeader()
    }

    format() {

    }
}