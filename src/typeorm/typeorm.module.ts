import { Module } from '@nestjs/common';
import { TypeOrmClient } from './client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPositionOrmEntity } from 'src/accounting/dal/orm-entities/report-position.orm-entity';
import { ReportOrmEntity } from 'src/accounting/dal/orm-entities/report.orm-entity';
import { WarehouseOrmEntity } from 'src/warehouse/dal/orm-entities/warehouse.orm-entity';
import { config } from 'src/config';
import { OrderOrmEntity as WarehouseOrderOrmEntity } from '../warehouse/dal/orm-entities/order.orm-entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.name,
      entities: [
        ReportPositionOrmEntity,
        ReportOrmEntity,
        WarehouseOrmEntity,
        WarehouseOrderOrmEntity,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [TypeOrmClient],
  exports: [TypeOrmClient],
})
export class TypeORM {}
