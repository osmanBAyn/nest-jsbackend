import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth2';
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService : ConfigService, private readonly userService : UsersService){

        super({
            clientID : configService.get("GOOGLE_CLIENT_ID"),
            clientSecret : configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL : configService.get("GOOGLE_CALLBACK_URL"),
            scope : ['email'],
            userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo"
        })
    }
    async validate(_accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback, ) : Promise<any>{
            console.log(profile);
            const email = profile.email;
            let found =await this.userService.findUser(email);
            if(!found){
                await this.userService.insertUser(email, "google", profile.picture);
                found =await this.userService.findUser(email);
            }
            const user = {
                email,
                profilePictureURL : profile.picture,
                userId : found.id
            }
            done(null, user);
    }
}

