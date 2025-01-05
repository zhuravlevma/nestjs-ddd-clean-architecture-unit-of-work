import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { UnitOfWork } from './uow';

@Injectable()
export class TypeOrmClient implements UnitOfWork {
  private asyncLocalStorage = new AsyncLocalStorage<QueryRunner>();

  constructor(private readonly dataSource: DataSource) {}

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      return await this.asyncLocalStorage.run(queryRunner, async () => {
        try {
          const result = await fn();

          await queryRunner.commitTransaction();

          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        }
      });
    } finally {
      await queryRunner.release();
    }
  }

  get client(): EntityManager {
    const queryRunner = this.asyncLocalStorage.getStore();

    return queryRunner ? queryRunner.manager : this.dataSource.manager;
  }
}
