import {CustomResponse} from "../../../../framework/error/customResponse";
import {HttpRequest, HttpResponse, NextFunction} from "../../../../config/interfaces/adapters/server.interface";
import {IdService} from "../id/id.service";
import {HasherInterface} from "../../../../config/interfaces/adapters/hasher.interface";
import {EmailServiceInterface} from "../../../../config/interfaces/services/email.service.interface";
import {UserRepositoryInterface} from "../../../../config/interfaces/repositories/user.repository.interface";
import {RegisterServiceInterface} from "../../../../config/interfaces/services/register.service.interface";
import {UserEntitiesInterface} from "../../../../domain/user.entities.interface";

export class RegisterService implements RegisterServiceInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private mailService: EmailServiceInterface,
        private readonly hasher: HasherInterface,
        private readonly id: IdService
    ) {
    }

    async register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
        try {
            const {email, password, username}: { email: string, password: string, username: string } = req.body;
            const userData: UserEntitiesInterface = req.body;
            const user = await this.userRepository.findUserByEmail(email);
            if (user) {
                throw new CustomResponse(400, 'Email already exists');
            }
            const usernameExists = await this.userRepository.findUserByUsername(username);
            if (usernameExists) {
                throw new CustomResponse(401, 'Username already exists');
            }
            const hashedPassword = await this.hasher.hash(password, 10);
            const confirmationCode = this.id.uuid();
            const confirmationLink = `${process.env.FRONTEND_URL}/confirm/${confirmationCode}`;
            const confirmationExpiresAt = new Date();
            confirmationExpiresAt.setHours(confirmationExpiresAt.getHours() + 1);
            const newUser = {...userData}
            newUser.email = email;
            newUser.password = hashedPassword;
            newUser.username = username;
            newUser.isConfirmed = false;
            newUser.confirmationExpiresAt = confirmationExpiresAt;
            newUser.confirmationToken = confirmationCode;
            const userSave = await this.userRepository.create(newUser);
            console.log(`userSave: ${userSave}`);
            const emailData = {
                to: email,
                subject: 'Confirm your email',
                html: `<h1>Confirm your email</h1>
                <p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`
            };
            await this.mailService.sendConfirmationEmail(emailData.to, emailData.subject);
            res.status(201).json({message: 'User created successfully'});
        } catch (error) {
            next(error);
        }
    }
}