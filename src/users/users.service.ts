import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { first } from 'rxjs';
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
    async addFriend(userId :number, friendId : number){
        // await this.db.user.update({
        //     where : {
        //         email : email2
        //     },
        //     data : {
        //         userFriends : {}
        //     }
        // });
        // await this.db.user.update({
        //     where : {
        //         email : email
        //     },
        //     data : {
        //         friends : {connect :[{email : email2}]}
        //     }
        // })
        const userFriends = await this.db.user.findUnique({
            where : {
                id : userId
            },
            include : {
                userFriends : true
            }
        });
        let dontCreate = false;
        for(let i=0;i<userFriends.userFriends.length;i++){
            if(userFriends.userFriends[i].friendUserId===friendId){
                dontCreate = true;
            }
        }
        if(!dontCreate){
            await this.db.friendship.create({
                data : {
                    User : {connect : {id : userId}},
                    FriendUser : {connect: {id : friendId}}
                }
            });
        }
        
    }
    async createDirectConversation(userId : number, friendId : number){
        return await this.db.conversation.create({
            data : {
                name : "first conversation",
                users : {connect:[{id :userId },{id : friendId}]},
            },
            include : {
                users : true
            }
        });
    }
    async getDirectConversation(userId : number){
        let conv = await this.db.user.findUnique({
            where : {
                id : userId,
            },
            select : {
                conversations : {
                    where : {
                        isGroup : false
                    },
                    select : {users : {
                        select : {
                            email : true,
                            id : true,
                            profilePictureURL : true
                        }
                    },
                        id : true,
                        messages : true
                    }
                }
            }
        });
        return conv;
    }
    async getAllUsers(){
        return (await this.db.user.findMany()).map((val)=>{
            return {
                email : val.email, 
                id : val.id,
                profilePictureURL : val.profilePictureURL
            };
        });
    }
    async getFriends(userId){
        const friends = await this.db.user.findUnique({
            where : {
                id : userId
            },
            select : {
                userFriends : true,
            }
        });
        let friend = [];
        for(let i=0;i<friends.userFriends.length;i++){
            friend.push(await this.db.user.findUnique({
                where : {
                    id : friends.userFriends[i].friendUserId
                },
                select : {
                    id : true,
                    email : true,
                    profilePictureURL : true
                }
            }));
        }
        return friend;
    }
    async createMessage(conversationId : number, senderId : number, messageBody : string){
        return await this.db.message.create({
            data: {
                conversation : {connect : {id : conversationId}},
                sender : {connect : {id : senderId}},
                body : messageBody
            },
            include : {
                sender : true
            }
        });
    }
    async getMessages(conversationId : number){
        return this.db.conversation.findUnique({
            where : {
                id : conversationId
            },
            include : {
                messages : {
                    include : {
                        sender : true
                    }
                }
            }
        });
    }
}
