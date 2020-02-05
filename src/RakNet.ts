import PacketHandler from "./Handlers/PacketHandler";
import BinaryStream from "./Utils/BinaryStream";
import * as dgram from 'dgram';
import { EventEmitter } from 'events';

export interface Recipient {
    type: Number;
    ip: string;
    port: Number;
}

class RakNet extends EventEmitter {
    private logger: Logger;
    private packetHandler: PacketHandler;
    private socket: dgram;

    constructor () {
        super();
        this.packetHandler = new PacketHandler();
        this.logger = new Logger('RakNet');
    }

    public stop(): void {
        this.socket.close();
    }

    public start(ip: string = '127.0.0.1', port: number): void {
        this.socket = dgram.createSocket('udp4');
        
        this.socket.on('message', (message: Buffer, recipient: dgram.RemoteInfo) => {
            if (!message.length) return;

            const stream = new BinaryStream(message);

            try {
                this.handleRequest(stream, {
                    type: recipient.family === 'IPv4' ? 4 : 6,
                    ip: recipient.address,
                    port: recipient.port,
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

    public handleRequest(stream: BinaryStream, recipient: Recipient): void {
        if (!this.packetHandler.hasConnection(recipient)) {
            this.logger.error(`Ignored packet from: ${recipient.ip} due to no open connection.`);
            return;
        } else {
            const connection: Connection = this.packetHandler.getConnection(recipient);
        }
    }
}

export default RakNet;