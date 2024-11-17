import { openSync, readSync, writeSync, fstatSync, closeSync } from 'fs';

export default class WritableSpace {
    #fsSize;
    #fileDescriptor;

    constructor(filePath, fsSize = 2 ** 20) {
        this.#fsSize = fsSize;
        this.#fileDescriptor = this.#initializeFile(filePath);
    }

    getSize() {
        return this.#fsSize;
    }

    isInBounds(pos) {
        return pos >= 0 && pos < this.#fsSize;
    }

    readByte(pos) {
        if (!this.isInBounds(pos)) {
            throw new Error(`READPOS ${pos} is not valid (0 >= && < ${this.getSize()})`);
        }

        const buffer = Buffer.alloc(1);
        const bytesRead = readSync(this.#fileDescriptor, buffer, 0, 1, pos);

        if (bytesRead !== 1) {
            throw new Error(`Failed to read byte at position ${pos}`);
        }

        return buffer[0];
    }

    writeByte(pos, val) {
        if (!this.isInBounds(pos)) {
            throw new Error(`WRITEPOS ${pos} is not valid (0 >= && < ${this.getSize()})`);
        }

        const buffer = Buffer.from([val]);
        const bytesWritten = writeSync(this.#fileDescriptor, buffer, 0, 1, pos);

        if (bytesWritten !== 1) {
            throw new Error(`Failed to write byte at position ${pos}`);
        }
    }

    readBytes(pos, length) {
        const bufferEnd = pos + length;
        if (!this.isInBounds(pos) || !this.isInBounds(bufferEnd - 1)) {
            throw new Error(`Range ${pos} to ${bufferEnd} is out of bounds (0 >= && < ${this.getSize()})`);
        }

        const buffer = Buffer.alloc(length);
        const bytesRead = readSync(this.#fileDescriptor, buffer, 0, length, pos);

        if (bytesRead !== length) {
            throw new Error(`Failed to read ${length} bytes from position ${pos}`);
        }

        return buffer;
    }

    writeBytes(pos, data) {
        const bufferEnd = pos + data.length;
        if (!this.isInBounds(pos) || !this.isInBounds(bufferEnd - 1)) {
            throw new Error(`Range ${pos} to ${bufferEnd} is out of bounds (0 >= && < ${this.getSize()})`);
        }

        const bytesWritten = writeSync(this.#fileDescriptor, data, 0, data.length, pos);

        if (bytesWritten !== data.length) {
            throw new Error(`Failed to write ${data.length} bytes to position ${pos}`);
        }
    }

    #initializeFile(filePath) {
        let fd;
        try {
            // Open the file, creating it if it doesn't exist
            fd = openSync(filePath, 'a+');
            const stats = fstatSync(fd);
            if (stats.size !== this.#fsSize) {
                // Resize the file to match the fsSize
                writeSync(fd, Buffer.alloc(this.#fsSize), 0, this.#fsSize, 0);
            }
        } catch (error) {
            if (fd) closeSync(fd);
            throw new Error(`Failed to initialize file: ${error.message}`);
        }

        return fd;
    }

    close() {
        if (this.#fileDescriptor) {
            closeSync(this.#fileDescriptor);
            this.#fileDescriptor = null;
        }
    }
}