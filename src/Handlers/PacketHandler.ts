import Packet from "../packets/Packet";
import { Recipient } from '../RakNet';

class PacketHandler {
    private connections: Array<Connection>
    private packetPool: Map<Number, Packet>;

    constructor () {
        this.connections = [];
        this.packetPool = new Map();
    }

    hasConnection(recipient: Recipient): Boolean {
        return false;
    }

    getConnection(recipient: Recipient): Connection {
        return this.connections.find((c) => { c.ip === recipient.ip && c.port === recipient.port });
    }
}

export default PacketHandler;