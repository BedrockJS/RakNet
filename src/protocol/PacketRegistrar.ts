import Packet from './Packet';
import Protocol from './Protocol';

/**
 * ACK PACKETS
 */
import ConnectedPing from './ack/ConnectedPing';
import ConnectedPong from './ack/ConnectedPong';
import ConnectionRequest from './ack/ConnectionRequest';
import ConnectionRequestAccepted from './ack/ConnectionRequestAccepted';
import Datagram from './ack/Datagram';
import EncapsulatedPacket from './ack/EncapsulatedPacket';
import GamePacketWrapper from './ack/GamePacketWrapper';
import IncompatibleProtocol from './ack/IncompatibleProtocol';
import NewIncomingConnection from './ack/NewIncomingConnection';
import OpenConnectionRequestOne from './ack/OpenConnectionRequestOne';
import OpenConnectionRequestTwo from './ack/OpenConnectionRequestTwo';
import OpenConnectionReplyOne from './ack/OpenConnectionReplyOne';
import OpenConnectionReplyTwo from './ack/OpenConnectionReplyTwo';
import Reliability from './ack/Reliability';
import UnconnectedPing from './ack/UnconnectedPing';
import UnconnectedPong from './ack/UnconnectedPong';

export const ACK = {
    ConnectedPing: ConnectedPing,
    ConnectedPong: ConnectedPong,
    ConnectionRequest: ConnectionRequest,
    ConnectionRequestAccepted: ConnectionRequestAccepted,
    Datagram: Datagram,
    EncapsulatedPacket: EncapsulatedPacket,
    GamePacketWrapper: GamePacketWrapper,
    IncompatibleProtocol: IncompatibleProtocol,
    NewIncomingConnection: NewIncomingConnection,
    OpenConnectionRequestOne: OpenConnectionRequestOne,
    OpenConnectionRequestTwo: OpenConnectionRequestTwo,
    OpenConnectionReplyOne: OpenConnectionReplyOne,
    OpenConnectionReplyTwo: OpenConnectionReplyTwo,
    Reliability: Reliability,
    UnconnectedPing: UnconnectedPing,
    UnconnectedPong: UnconnectedPong
};

/** 
 * Not sure if I want to keep this,
 ********************************
class PacketRegistrar {
    private registered: Array<any> = [];

    constructor() {
        this.registered = [];
    }

    public registerDefaults(): boolean {
        this.register(Protocol.CONNECTED_PING, ConnectedPing);
        this.register(Protocol.CONNECTED_PONG, ConnectedPong);
        this.register(Protocol.CONNECTION_REQUEST, ConnectionRequest);
        this.register(Protocol.CONNECTION_REQUEST_ACCEPTED, ConnectionRequestAccepted);
        this.register(Protocol.STRUCTURE_TEMPLATE_DATA_REQUEST, EncapsulatedPacket);
        this.register(Protocol.INCOMPATIBLE_PROTOCOL, IncompatibleProtocol);
        this.register(Protocol.NEW_INCOMING_CONNECTION, NewIncomingConnection);
        this.register(Protocol.OPEN_CONNECTION_REPLY_1, OpenConnectionReplyOne);
        this.register(Protocol.OPEN_CONNECTION_REPLY_2, OpenConnectionReplyTwo);
        this.register(Protocol.OPEN_CONNECTION_REQUEST_1, OpenConnectionRequestOne);
        this.register(Protocol.OPEN_CONNECTION_REQUEST_2, OpenConnectionRequestTwo);
        this.register(Protocol.UNCONNECTED_PING, UnconnectedPing);
        this.register(Protocol.UNCONNECTED_PONG, UnconnectedPong);
        return true;
    }

    public register(protocol: Protocol, packet: any, force: boolean = false): boolean {
        if (force) {
            this.registered[protocol]
            return true;
        } else {
            if (this.registered[protocol] !== undefined) {
                return false;
            } else {
                this.registered[protocol] = packet;
                return true;
            }
        }
    }

    public unregister(protocol: Protocol): boolean {
        if (this.registered[protocol] === undefined) {
            return false;
        } else {
            delete this.registered[protocol];
            return true;
        }
    }

    public getPacket(protocol: Protocol): Packet | boolean {
        return (this.registered[protocol] === undefined) ? false : this.registered[protocol];
    }
}

export default PacketRegistrar;
*/