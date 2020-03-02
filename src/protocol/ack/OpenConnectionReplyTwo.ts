import Packet from '../Packet';
import Protocol, { SERVER_ID } from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';

export default class OpenConnectionRequestTwo extends Packet {

    public port: number;
    public mtuSize: number;

    constructor(port: number, mtuSize: number) {
        super(Protocol.OPEN_CONNECTION_REPLY_2);

        this.port = port;
        this.mtuSize = mtuSize;
    }

    protected encodeBody() {
        return this.getStream()
            .writeMagic()
            .writeLong(SERVER_ID)
            .writeShort(this.port)
            .writeShort(this.mtuSize)
            .writeByte(0);
    }
}