import { WarehouseEntity } from '../domain/entities/warehouse.entity';
import { WarehouseMapper } from './warehouse.mapper';
import { SaveWarehouseOutPort } from '../domain/ports/out/save-warehouse.out-port';
import { Injectable } from '@nestjs/common';
import { GetWarehouseWithOrderOutPort } from '../domain/ports/out/get-warehouse-with-order.out-port';
import { GetWarehouseWithOrdersOutPort } from '../domain/ports/out/get-warehouse-with-orders.out-port';
import { WarehouseOrmEntity } from './orm-entities/warehouse.orm-entity';
import { TypeOrmClient } from 'src/typeorm/client';

@Injectable()
export class WarehouseRepository
  implements
    SaveWarehouseOutPort,
    GetWarehouseWithOrdersOutPort,
    GetWarehouseWithOrderOutPort
{
  constructor(private readonly typeormClient: TypeOrmClient) {}

  async getWarehouseWithOrderPort(
    warehouseId: string,
    orderId: string,
  ): Promise<WarehouseEntity> {
    const whOrm = await this.typeormClient.client
      .getRepository(WarehouseOrmEntity)
      .createQueryBuilder('warehouses')
      .leftJoinAndSelect('warehouses.orders', 'orders')
      .where('warehouses.id = :warehouseId', { warehouseId })
      .andWhere('orders.id = :orderId', { orderId })
      .getOne();

    return WarehouseMapper.mapToDomain(whOrm);
  }

  async getWarehouseWithOrdersPort(
    warehouseId: string,
  ): Promise<WarehouseEntity> {
    const whOrm = await this.typeormClient.client
      .getRepository(WarehouseOrmEntity)
      .findOne({
        where: {
          id: warehouseId,
        },
        relations: {
          orders: true,
        },
      });
    return WarehouseMapper.mapToDomain(whOrm);
  }

  async saveWarehouse(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
    const warehouseORM = WarehouseMapper.mapToORM(warehouse);

    const whOrm = await this.typeormClient.client
      .getRepository(WarehouseOrmEntity)
      .save(warehouseORM);

    return WarehouseMapper.mapToDomain(whOrm);
  }
}
