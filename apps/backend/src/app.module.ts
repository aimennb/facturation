import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { databaseConfig } from './config/database.config.js';
import { jwtConfig } from './config/jwt.config.js';
import { validationSchema } from './config/validation.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { SuppliersModule } from './modules/suppliers/suppliers.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { AdvancesModule } from './modules/advances/advances.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { AuditModule } from './modules/audit/audit.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validationSchema
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true }
              }
            : undefined
      }
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
        synchronize: false
      })
    }),
    AuthModule,
    UsersModule,
    SuppliersModule,
    ProductsModule,
    InvoicesModule,
    AdvancesModule,
    PaymentsModule,
    ReportsModule,
    SettingsModule,
    AuditModule
  ]
})
export class AppModule {}
