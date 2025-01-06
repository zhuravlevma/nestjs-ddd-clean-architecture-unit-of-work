# Unit of work pattern for TypeORM

```typescript
return this.uow.transaction(async () => {
  const updatedWh = await this.saveWhPort.saveWarehouse(warehouse);
  await this.saveReport.save(report);
  return updatedWh;
});
```

![image](https://github.com/zhuravlevma/prisma-unit-of-work/assets/44276887/6ebd10bd-fd88-42cb-8c7c-71a162283e04)
