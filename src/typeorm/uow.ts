export interface UnitOfWork {
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}
