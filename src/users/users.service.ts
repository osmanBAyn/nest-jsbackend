import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
    constructor(private readonly db : DbService){}
    async insertUser(email : string, password : string, profilePictureURL ?: string){
        const isAlreadyCreated = await this.db.user.findUnique({
            where: {
                email
            }
        });
        if(!isAlreadyCreated){
            const newUser = await this.db.user.create({
                data : {
                    email,
                    password,
                    profilePictureURL
                }
            });
            return newUser;
        }
    }
    async findUser(email : string){
        const found = await this.db.user.findUnique({
            where : {
                email
            }
        });
        return found;
    }
}
