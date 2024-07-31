import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService : UsersService){}
    async validateUser(email : string, password : string){
        console.log("auth service");
        const user = await this.usersService.findUser(email);
        if(!user){
            throw new HttpException("User is not found", HttpStatus.BAD_REQUEST);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(user && isPasswordValid){
            return {
                email : user.email,
                userId : user.id,
                profilePictureURL : user.profilePictureURL
            }
        }
        return null;
    }
}
