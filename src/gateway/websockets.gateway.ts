import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({
    cors: {
        origin : 'http://localhost:4200',
        credentials : true
    }
})
export class WebsocketsGateway implements OnGatewayConnection{
    constructor(private usersService : UsersService){}
    @WebSocketServer()
    private io : Server;
    handleConnection(client: any, ...args: any[]) {
        console.log(client.id + " connected");
    }
    @SubscribeMessage('message')
    async handleMessage(client :any, data: any){
        const message = await this.usersService.createMessage(data[1],+data[2],data[0]);
        this.io.to(data[1]).emit("message",message);
    }
    @SubscribeMessage('join')
    join(client : any, data : any){
        client.join(data);
    }
    // constructor(private socketService : SocketService){}
    // handleConnection(client: Socket) {
    //     this.socketService.handleConnection(client);
    // }
    // @SubscribeMessage('message')
    // handleMessage(@MessageBody() message : string, @ConnectedSocket() client: Socket) : void{
    //     this.server.emit('message', message);
    //     // this.server.sockets.socket("").emit("merhaba");
    // }
}