import { Module } from "@nestjs/common";
import { WebsocketsGateway } from "./websockets.gateway";
import { UsersService } from "src/users/users.service";

@Module({
    providers : [
        WebsocketsGateway
    ],
    imports : [UsersService]
})
export class WebsokcetsGatewayModule{

}
