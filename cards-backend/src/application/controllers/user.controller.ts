import {Delete, Get, Post, Route,} from '../../framework/router/custom/decorator';
import {UserControllerInterface} from '../../config/interfaces/controllers/user.controller.interface';
import {UserServiceInterface} from '../../config/interfaces/services/user.service.interface';
import {EmailServiceInterface} from '../../config/interfaces/services/email.service.interface';
import {CustomResponse} from '../../framework/error/customResponse';
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {UserEntitiesInterface} from "../../domain/user.entities.interface";
import {CollectionServiceInterface} from "../../config/interfaces/services/collection.service.interface";

@Route('/user')
export class UserController implements UserControllerInterface {

    constructor(
        private readonly userService: UserServiceInterface,
        private readonly emailService: EmailServiceInterface,
        private readonly collectionService: CollectionServiceInterface,
    ) {
    }

    @Post('/register')
    async register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const body: UserEntitiesInterface = req.body;
        await this.userService.create(body).then(async (user) => {
            await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken as string).then(() => {
                res.status(201).json("User created successfully");
            }).catch((err) => {
                throw new CustomResponse(500, `err.message ${err.message}`);
            });
        }).catch((err) => {
            throw new CustomResponse(500, `err.message ${err.message}`);
        });
    }

    @Get('/confirm/:token')
    async confirmAccount(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        try {
            await this.userService.confirmUser(req.params.token).then((user) => {
                this.collectionService.create(user.id).then(() => {
                    return res.status(200).json("User confirmed");
                }).catch((error) => {
                    throw new CustomResponse(500, error.message);
                });
            }).catch((error) => {
                throw new CustomResponse(500, error.message);
            });
        } catch (error) {
            throw new CustomResponse(500, "Something went wrong")
        }
    }

    @Post('/find-by-email/:email', {middlewares: ['isAuthenticated', 'isSuperUser', 'isAdmin']})
    async findByEmail(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        try {
            await this.userService.findByEmail(req.params.email).then((user) => {
                return res.status(200).json(user);
            }).catch(() => {
                throw new CustomResponse(500, 'User not found');
            });
        } catch (error) {
            throw new CustomResponse(500, "Something went wrong")
        }
    }

    @Post('/find-by-username/:username', {middlewares: ['isAuthenticated']})
    async findByUsername(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        try {
            await this.userService.findByUsername(req.params.username).then((user) => {
                return res.status(200).json(user?.username);
            }).catch(() => {
                throw new CustomResponse(500, 'User not found');
            });
        } catch (error) {
            throw new CustomResponse(500, "Something went wrong")
        }
    }

    @Post('/update', {middlewares: ['isAuthenticated']})
    async update(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const user = req.user;
        if (user?.email) {
            try {
                await this.userService.update(req.body, user).then(() => {
                    res.status(200).json('User updated');
                }).catch((error) => {
                    throw new CustomResponse(500, error.message);
                });
            } catch (error) {
                throw new CustomResponse(500, "Something went wrong")
            }
        }
    }

    @Delete('/archive', {middlewares: ['isAuthenticated']})
    async handleUserArchive(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const user = req.user;
        if (user?.email) {
            const userEmail = req.body.email;
            const userToArchive = await this.userService.findByEmail(userEmail);
            if (!userToArchive) throw new CustomResponse(404, 'User not found');
            try {
                await this.userService.update(userToArchive, user, false, true).then((user) => {
                    res.status(200).json({message: user.archive ? 'User archived' : 'User unarchived'});
                }).catch((error) => {
                    throw new CustomResponse(404, `User not found ${error}`);
                });
            } catch (error) {
                throw new CustomResponse(500, "Something went wrong")
            }
        }
    }

    @Post('/ban', {middlewares: ['isAuthenticated', 'isSuperUser', 'isAdmin'],})
    async handleUserBan(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        const user = req.user;
        if (user?.email) {
            const userEmail = req.body.email;
            const userToBan = await this.userService.findByEmail(userEmail);
            if (!userToBan) throw new CustomResponse(404, 'User not found');
            try {
                await this.userService.update(userToBan, user, true, false).then((user) => {
                    res.status(200).json({message: user.banned ? 'User banned' : 'User unbanned'});
                }).catch((error) => {
                    throw new CustomResponse(500, `Something went wrong ${error}`);
                });
            } catch (error) {
                throw new CustomResponse(500, "Something went wrong")
            }
        }
    }
}
