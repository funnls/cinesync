import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { UserDao } from '../dao/user.dao';

@Module({
	imports: [PrismaModule, EmailModule],
	controllers: [UsersController],
	providers: [UsersService, AuthService, UserDao],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
