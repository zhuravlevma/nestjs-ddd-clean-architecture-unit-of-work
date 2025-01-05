import { Injectable } from '@nestjs/common';
import { BillOfLadingMapper as ReportMapper } from './report.mapper';
import { FindReportByIdOutPort } from '../domain/ports/out/find-report-by-id.out-port';
import { SaveReportOutPort } from '../domain/ports/out/save-report.out-port';
import { ReportEntity } from '../domain/entities/report.entity';
import { TypeOrmClient } from 'src/typeorm/client';
import { ReportOrmEntity } from './orm-entities/report.orm-entity';

@Injectable()
export class ReportRepository
  implements FindReportByIdOutPort, SaveReportOutPort
{
  constructor(private readonly typeormClient: TypeOrmClient) {}

  async findReportById(reportId: string): Promise<ReportEntity> {
    const [order] = await this.typeormClient.client
      .getRepository(ReportOrmEntity)
      .find({
        where: { id: reportId },
        relations: {
          positions: true,
        },
      });
    return ReportMapper.mapToDomain(order);
  }

  async save(report: ReportEntity): Promise<ReportEntity> {
    const reportOrm = ReportMapper.mapToOrm(report);

    const savedReport = await this.typeormClient.client
      .getRepository(ReportOrmEntity)
      .save(reportOrm);

    return ReportMapper.mapToDomain(savedReport);
  }
}
