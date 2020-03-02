import Packet from "../protocol/Packet";
import Connection from '../Utils/Connection';
import Address from '../Types';
import Server from '@/Server';

class ConnectionHandler {
    private connections: Connection[];
    private packetPool: Map<Number, Packet>;
    private server: Server;

    constructor (server: Server) {
        this.connections = [];
        this.packetPool = new Map();
        this.server = server;
    }

    addConnection(client: Address, mtuSize: number): Boolean {
        if (this.hasConnection(client)) {
            return false;
        } else {
            const connection = new Connection(client, mtuSize, this, this.server);
            this.connections.push(connection);
            return true;   
        }
    }

    hasConnection(client: Address): Boolean {
        return !!this.getConnection(client);
    }

    getConnection(client: Address): Connection {
        return this.connections.find((c) => { c.address.ip === client.ip && c.address.port === client.port });
    }

    closeAllConnections(reason = 'Unknown Reason') {
        this.packetPool.clear();
        this.connections.forEach((c) => {
            c.disconnect(reason);
        });
    }
}

export default ConnectionHandler;