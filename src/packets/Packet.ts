import Protocol from './Protocol';
import BinaryStream from '../Utils/BinaryStream';

abstract class Packet {
    private id: Protocol;
    private stream: BinaryStream;
    private encoded: Boolean;
    public abstract batchable: boolean;

    constructor (id: Protocol, stream?: BinaryStream) {
        this.id = id;
        if (!stream) {
            this.stream = new BinaryStream();
        } else {
            this.stream = stream;
            this.stream.increaseOffset(1);
        }
    }

    public getId(): Protocol {
        return this.id;
    }

    public isEncoded(): Boolean {
        return this.encoded;
    }

    public setStream(stream: BinaryStream, updateId: boolean = false): void {
        this.stream = stream;

        if (updateId) {
            this.id = this.stream.buffer[0];
        }
    }

    protected encodeHeader() {
        // Write packet id to stream.
        this.stream.writeByte(this.id);
    }

    public encode(): void {
        if (!this.encoded) {
            this.encoded = true;
            this.stream = new BinaryStream();
            this.encodeHeader();
            this.encodeBody();
            return;
        } else {
            throw 'Packet not decoded.';
        }
    }

    abstract encodeBody(): any;

    /**
     * Found this was pretty useful, because it checks
     * to make sure packet ids are correct.
     */
    protected decodeHeader(): void {
        const id: Number = this.stream.readByte();

        if (this.id !== id) {
            throw 'Packet id invalid.';
        }
    }

    public decode(): void {
        if (this.encoded) {
            this.decodeHeader();
            this.decodeBody();
            this.encoded = false;
            return;   
        } else {
            throw 'Packet not encoded.'
        }
    }

    abstract decodeBody(): any;
}

export default Packet;