import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportPositionOrmEntity } from './dal/orm-entities/report-position.orm-entity';
import { ReportOrmEntity } from './dal/orm-entities/report.orm-entity';
import { ReportRepository } from './dal/report.repository';
import { CreateReportInteractor } from './domain/interactors/create-report.interactor';
import { FindReportByIdInteractor } from './domain/interactors/find-report-by-id.interactor';
import { CreateReportInPort } from './domain/ports/in/create-report.in-port';
import { FindReportByIdInPort } from './domain/ports/in/find-report-by-id.in-port';
import { FindPositionByIdOutPort } from './domain/ports/out/find-position-by-id.out-port';
import { FindReportByIdOutPort } from './domain/ports/out/find-report-by-id.out-port';
import { SaveReportOutPort } from './domain/ports/out/save-report.out-port';
import { TypeORM } from 'src/typeorm/typeorm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportOrmEntity, ReportPositionOrmEntity]),
    TypeORM,
  ],
  controllers: [ReportController],
  providers: [
    {
      provide: CreateReportInPort,
      useFactory: (a) => new CreateReportInteractor(a),
      inject: [SaveReportOutPort],
    },
    {
      provide: FindReportByIdInPort,
      useFactory: (a) => new FindReportByIdInteractor(a),
      inject: [FindReportByIdOutPort],
    },
    {
      provide: FindReportByIdOutPort,
      useClass: ReportRepository,
    },
    {
      provide: FindPositionByIdOutPort,
      useClass: ReportRepository,
    },
    {
      provide: SaveReportOutPort,
      useClass: ReportRepository,
    },
  ],
  exports: [SaveReportOutPort],
})
export class AccountingModule {}
