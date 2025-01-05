import { Module } from '@nestjs/common';
import { AccountingModule } from './accounting/accounting.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { TypeORM } from './typeorm/typeorm.module';
@Module({
  imports: [AccountingModule, WarehouseModule, TypeORM],
})
export class AppModule {}
