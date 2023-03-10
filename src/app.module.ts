import { BlogModule } from './blog/blog.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { redisStore } from 'cache-manager-redis-store';
import {
  CacheModule,
  CacheStore,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    CacheModule.register({
      store: redisStore as undefined as CacheStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: false,
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TodoModule,
    AuthModule,
    BlogModule,
    LanguageModule,
  ],
})
export class AppModule {
  Configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
