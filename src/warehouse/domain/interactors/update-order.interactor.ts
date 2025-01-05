import { UnitOfWork } from 'src/typeorm/uow';
import { WarehouseEntity } from '../entities/warehouse.entity';
import {
  UpdateOrderInPort,
  UpdateOrderCommand,
} from '../ports/in/update-order.in-port';
import { GetWarehouseWithOrderOutPort } from '../ports/out/get-warehouse-with-order.out-port';
import { SaveWarehouseOutPort } from '../ports/out/save-warehouse.out-port';
import { randomUUID } from 'crypto';
import { ReportEntity } from 'src/accounting/domain/entities/report.entity';
import { SaveReportOutPort } from 'src/accounting/domain/ports/out/save-report.out-port';

export class UpdateOrderInteractor implements UpdateOrderInPort {
  constructor(
    private readonly getWarehouseWithOrderPort: GetWarehouseWithOrderOutPort,
    private readonly saveWhPort: SaveWarehouseOutPort,
    private readonly uow: UnitOfWork,
    private readonly saveReport: SaveReportOutPort,
  ) {}
  async execute(
    updateOrderStatusCommand: UpdateOrderCommand,
  ): Promise<WarehouseEntity> {
    const warehouse =
      await this.getWarehouseWithOrderPort.getWarehouseWithOrderPort(
        updateOrderStatusCommand.warehouseId,
        updateOrderStatusCommand.orderId,
      );

    if (updateOrderStatusCommand.isValid) {
      warehouse.changeOrderStatusToValid(updateOrderStatusCommand.orderId);

      const report = new ReportEntity({
        id: randomUUID(),
        orderId: updateOrderStatusCommand.orderId,
        isValid: false,
        positions: [],
      });

      return this.uow.transaction(async () => {
        const updatedWh = await this.saveWhPort.saveWarehouse(warehouse);
        await this.saveReport.save(report);
        return updatedWh;
      });
    }

    return this.saveWhPort.saveWarehouse(warehouse);
  }
}
