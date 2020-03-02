import ConnectionHandler from './Handlers/ConnectionHandler';
import BinaryStream from './Utils/BinaryStream';
import Protocol from './protocol/Protocol';
import Logger from '@/utils/Logger';
import Server from '@/Server';
import * as dgram from 'dgram';
import Connection from './Utils/Connection';
import Address from './Types';
import { EventEmitter } from 'events';
import { ACK } from './protocol/PacketRegistrar';


class RakNet extends EventEmitter {
    private logger: Logger;
    private connectionHandler: ConnectionHandler;
    private socket: dgram.Socket | null = null;
    private server: Server;

    constructor(server: Server) {
        super();
        this.server = server;
        this.connectionHandler = new ConnectionHandler();
        this.logger = new Logger('RakNet');
    }

    public stop(): void {
        if (this.socket === null) {
            return;
        }
        /** Attempt to disconnect clients before abruptly closing */
        this.logger.debug('Closing active connections');
        this.connectionHandler.closeAllConnections();
        this.socket.close();
    }

    public start(ip: string = '127.0.0.1', port: number): void {
        this.socket = dgram.createSocket('udp4');

        this.socket.on('message', (message: Buffer, address: dgram.RemoteInfo) => {
            if (!message.length) return;

            const stream = new BinaryStream(message);

            try {
                this.handleRequest(stream, {
                    family: address.family === 'IPv4' ? 4 : 6,
                    ip: address.address,
                    port: address.port,
                });
            } catch (e) {
                this.logger.error(e.message);
                this.logger.error(e.stack);
            }
        });

        this.socket.on('error', (err: Error) => {
            this.emit('error', err);
            this.logger.error(err);
        });

        this.socket.on('listening', () => {
            this.emit('started');
        });

        this.socket.bind(port, ip, () => {
            this.logger.info('Starting RakNet');
        });
    }

    public sendPacket(address: Address, packet: any): void {
        try {
            this.socket.send(packet.buffer, address.port, address.ip);
        } catch (e) {
            this.logger.error('Failed to send packet to: ' + address.ip);
        }
        return;
    }

    public async handleRequest(stream: BinaryStream, address: Address): Promise<void> {
        if (!this.connectionHandler.hasConnection(address)) {
            this.handleUnconnected(stream, address);
            this.emit('ClientAttemptedConnect', address);
            this.logger.error(`Ignored packet from: ${address.ip} due to no open connection.`);
            return;
        } else {
            const connection: Connection = this.connectionHandler.getConnection(address);
            connection.handleStream(stream);
            return;
        }
    }

    public async handleUnconnected(stream: BinaryStream, address: Address): Promise<void> {
        const requestID: number = stream.buffer[0];
            if (requestID === Protocol.UNCONNECTED_PING) {
                /** QUERY */
                const pingPk = new ACK.UnconnectedPing(stream);
                const packet = new ACK.UnconnectedPong(pingPk.pingId, this.server.getName(), this.server.getMaxPlayers());
                this.sendPacket(address, packet.encode());

            } else if (requestID === Protocol.OPEN_CONNECTION_REQUEST_1) {
                
                const request = new ACK.OpenConnectionRequestOne(stream);

                if (request.protocol !== Protocol.PROTOCOL_VERSION) {
                    const packet = new ACK.IncompatibleProtocol();
                    this.server.send(address, packet.encode());
                } else {
                    const packet = new ACK.OpenConnectionReplyOne(request.mtuSize);
                    this.server.send(address, packet.encode());
                }

            } else if (requestID === Protocol.OPEN_CONNECTION_REQUEST_2) {

                const request = new ACK.OpenConnectionRequestTwo(stream);
                const packet = new ACK.OpenConnectionReplyTwo(request.port, request.mtuSize);

                if (this.connectionHandler.hasConnection(address)) {
                    this.logger.debug(address.ip + ' Attempted to connect but is already connected, lag?');
                    return;
                } else {
                    this.connectionHandler.addClient(address, request.mtuSize);

                    this.logger.debug('Created client for', `${address.ip}:${address.port}`)

                    this.server.send(packet.encode(), address);
                }

            } else {

                this.logger.error('Unimplemented packet:', requestID);

            }
        }
    }
}

export default RakNet;