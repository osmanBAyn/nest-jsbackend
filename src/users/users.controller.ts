import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DbService } from 'src/db/db.service';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthanticatedGuard } from '../auth/authanticated.guard';
import { GoogleOauthGuard } from 'src/auth/google.auth.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService){}
    @Post("signup")
    async addUser(@Body("email") email : string, @Body("password") password : string){
        const salts = 12;
        const hashedPassword = await bcrypt.hash(password, salts);
        const result = await this.usersService.insertUser(email, hashedPassword, '');
        if(!result){
            throw new HttpException("User is already created", HttpStatus.BAD_REQUEST);
        }
        return {
            msg : "User successfully created", 
            User : {
                email : result.email,
                userId : result.id,
                profilePictureURL : result.profilePictureURL
            }
        }
    }
    @UseGuards(LocalAuthGuard)
    @Post("login")
    login(@Req() req){
        return {
            User : req.user, 
            msg : "User logged in"
        };
    }
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async auth() {}
    @Get('callback')
    @UseGuards(GoogleOauthGuard)
    googleAuthCallback(@Req() req, @Res() res : Response) {    
        // res.cookie('access_token', req.user.access_token, {
        //     sameSite: true, 
        //     secure : false
        // })
        res.redirect("http://localhost:4200/home");
        
        // return res.send('<html><head><title>Main</title></head><body><h1>Login successful, turn back to page!</h1></body> </html>');
    };

    @UseGuards(AuthanticatedGuard)
    @Get("isAuthenticated")
    protected(@Req() req){
        return {
            User : req.user,
            msg : "User is authenticated"
        };
    }

    @Get("logout")
    logout(@Req() req){
        req.session.destroy();
        return {msg : "User session has ended"};
    }
}
