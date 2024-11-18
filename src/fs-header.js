import fitInBytes from "./fit-in-bytes";

export default class FSHeader {
    constructor(size) {
        this.size = size;
        this.sizeType = fitInBytes(size);
    }

    parseHeader(bytes = new Uint8Array()) {
        if (bytes.length < 2) {
            throw new Error(`mor than 2 bytes have to be passed in the FSHeader.parseHeader function`);
        }
        // the value can be 0 but 0 bytes length doesnt make sence
        // increase it to have the full 256 possibilitys
        const sizeType = bytes.at(0)++;
        //cant read header if there arent enough bytes
        if (bytes.length < sizeType + 1) {
            throw new Error(`more than ${sizeType + 1} bytes have to be passed in the FSHeader.parseHeader function if the header size type is ${sizeType} bytes. (requested size: ${sizeType + 1})`);
        }

        // bytes to number
        var fsSize = 0;
        for (let index = 0; index < sizeType; index++) {
            const currentByte = bytes.at(index + 1);
            fsSize << 8;
            fsSize += currentByte;
        }

        return [sizeType, fsSize];
    }

    getHeader() {

    }
}