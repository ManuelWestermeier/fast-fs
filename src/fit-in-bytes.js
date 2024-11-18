export default function fitInBytes(number) {
    if (number < 0) throw new Error(`NUMBER ${number} < 0`);
    number++;

    var bytesSize = 1;
    while (2 ** (bytesSize * 8) < number) {
        bytesSize++;
    }

    return bytesSize;
}