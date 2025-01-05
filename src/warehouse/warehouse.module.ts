import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateOrderInteractor } from './domain/interactors/update-order.interactor';
import { UpdateOrderInPort } from './domain/ports/in/update-order.in-port';
import { Module } from '@nestjs/common';
import { SaveWarehouseOutPort } from './domain/ports/out/save-warehouse.out-port';
import { AddOrderInPort } from './domain/ports/in/add-order.in-port';
import { AddOrderInteractor } from './domain/interactors/add-order.interactor';
import { CreateWarehouseInPort } from './domain/ports/in/create-warehouse.in-port';
import { CreateWarehouseInteractor } from './domain/interactors/create-warehouse.interactor';
import { GetWarehouseWithOrdersOutPort } from './domain/ports/out/get-warehouse-with-orders.out-port';
import { GetWarehouseWithOrderOutPort } from './domain/ports/out/get-warehouse-with-order.out-port';
import { OrderOrmEntity } from './dal/orm-entities/order.orm-entity';
import { WarehouseController } from './warehouse.controller';
import { WarehouseOrmEntity } from './dal/orm-entities/warehouse.orm-entity';
import { WarehouseRepository } from './dal/warehouse.repository';
import { TypeORM } from 'src/typeorm/typeorm.module';
import { SaveReportOutPort } from 'src/accounting/domain/ports/out/save-report.out-port';
import { AccountingModule } from 'src/accounting/accounting.module';
import { TypeOrmClient } from 'src/typeorm/client';

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseOrmEntity, OrderOrmEntity]),
    TypeORM,
    AccountingModule,
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseRepository,
    {
      provide: UpdateOrderInPort,
      useFactory: (a, b, c, d) => new UpdateOrderInteractor(a, b, c, d),
      inject: [
        SaveWarehouseOutPort,
        GetWarehouseWithOrderOutPort,
        TypeOrmClient,
        SaveReportOutPort,
      ],
    },
    {
      provide: CreateWarehouseInPort,
      useFactory: (a) => new CreateWarehouseInteractor(a),
      inject: [SaveWarehouseOutPort],
    },
    {
      provide: AddOrderInPort,
      useFactory: (a, b) => new AddOrderInteractor(a, b),
      inject: [GetWarehouseWithOrdersOutPort, SaveWarehouseOutPort],
    },
    {
      provide: GetWarehouseWithOrdersOutPort,
      useClass: WarehouseRepository,
    },
    {
      provide: GetWarehouseWithOrderOutPort,
      useClass: WarehouseRepository,
    },
    {
      provide: SaveWarehouseOutPort,
      useClass: WarehouseRepository,
    },
  ],
})
export class WarehouseModule {}
