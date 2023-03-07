import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
interface MyCacheModuleOptions {
  store: any;
  host: string;
  port: number;
  ttl: number;
  max: number;
  auth_pass: string;
  storeOptions?: {
    prefix: string;
  };
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.local.env'] }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MyCacheModuleOptions> => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL'),
        max: configService.get<number>('REDIS_MAX'),
        auth_pass: configService.get<string>('REDIS_PASSWORD'),
        storeOptions: {
          prefix: 'cache_',
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DATABASE_HOST'),
        port: ConfigService.get<number>('DATABASE_PORT'),
        username: ConfigService.get('DATABASE_USERNAME'),
        password: ConfigService.get('DATABASE_PASSWORD'),
        synchronize: ConfigService.get<boolean>('DATABASE_SYNC'),
        logging: ConfigService.get<boolean>('DATABASE_LOGGING'),
        database: ConfigService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    TodoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
