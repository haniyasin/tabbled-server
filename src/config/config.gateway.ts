import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ConfigService } from './config.service';
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Server, Socket } from "socket.io";
import { ConfigImportDto } from "./dto/request.dto";
import { AuthGuard } from "../auth/auth.guard";
let p = require('./../../package.json');

@UseGuards(JwtAuthGuard, AuthGuard)
@WebSocketGateway()
export class ConfigGateway {
    constructor(private readonly configService: ConfigService) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('config/getMany')
    async getMany(@MessageBody() msg: any, @ConnectedSocket() client: Socket) : Promise<any> {
        let data = await this.configService.getMany()

        return {
            success: true,
            data: data
        }
    }

    @SubscribeMessage('config/update')
    async syncMany(@MessageBody() msg: any, @ConnectedSocket() client: Socket) : Promise<any> {
        console.log('ConfigItems.sync, ', 'msg =', msg.data)
        try {
            for (let i in msg.data) {
                await this.configService.update(msg.data[i], client['userId'])
            }

            if (msg.data.length > 0)
                this.server.emit(`config/changed`, {})

            return {
                success: true
            }
        } catch (e) {
            console.error(e)
            return {
                success: false,
                error_message: e.toString()
            }
        }
    }

    @SubscribeMessage('config/getChanges')
    async getChanges(@MessageBody() msg: any, @ConnectedSocket() client: Socket) : Promise<any> {

        console.log('config/getChanges', msg)

        let data = await this.configService.getManyAfterRevision(Number(msg.lastRevision))

        return {
            success: true,
            data: data
        }
    }

    @SubscribeMessage('config/import')
    async import(@MessageBody() config: ConfigImportDto, @ConnectedSocket() client: Socket) : Promise<any> {

        try {
            await this.configService.import(config, client['userId'])
            this.server.emit(`config/changed`, {})

            return {
                success: true
            }
        } catch (e) {
            console.error(e)
            return {
                success: false,
                error_message: e.toString()
            }
        }
    }

    //Need to move to a separated module
    @SubscribeMessage('app/version')
    async appVersion() : Promise<any> {
        console.log('app/version')
        return {
            success: true,
            data: {
                version: p.version
            }
        }

    }
}
