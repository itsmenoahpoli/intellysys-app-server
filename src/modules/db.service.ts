export type PrismaModelDelegate = {
  findMany: (args?: any) => any;
  findFirst: (args?: any) => any;
  findUnique: (args?: any) => any;
  findUniqueOrThrow: (args?: any) => any;
  findFirstOrThrow: (args?: any) => any;
  create: (args?: any) => any;
  createMany: (args?: any) => any;
  update: (args?: any) => any;
  updateMany: (args?: any) => any;
  upsert: (args?: any) => any;
  delete: (args?: any) => any;
  deleteMany: (args?: any) => any;
  count: (args?: any) => any;
};

export class DBService<T extends PrismaModelDelegate = PrismaModelDelegate> {
  constructor(protected readonly model: T) {}

  findMany(args?: Parameters<T["findMany"]>[0]) {
    return this.model.findMany(args);
  }

  findFirst(args?: Parameters<T["findFirst"]>[0]) {
    return this.model.findFirst(args);
  }

  findUnique(args?: Parameters<T["findUnique"]>[0]) {
    return this.model.findUnique(args);
  }

  findUniqueOrThrow(args?: Parameters<T["findUniqueOrThrow"]>[0]) {
    return this.model.findUniqueOrThrow(args);
  }

  findFirstOrThrow(args?: Parameters<T["findFirstOrThrow"]>[0]) {
    return this.model.findFirstOrThrow(args);
  }

  create(args: Parameters<T["create"]>[0]) {
    return this.model.create(args);
  }

  createMany(args?: Parameters<T["createMany"]>[0]) {
    return this.model.createMany(args);
  }

  update(args: Parameters<T["update"]>[0]) {
    return this.model.update(args);
  }

  updateMany(args?: Parameters<T["updateMany"]>[0]) {
    return this.model.updateMany(args);
  }

  upsert(args: Parameters<T["upsert"]>[0]) {
    return this.model.upsert(args);
  }

  delete(args: Parameters<T["delete"]>[0]) {
    return this.model.delete(args);
  }

  deleteMany(args?: Parameters<T["deleteMany"]>[0]) {
    return this.model.deleteMany(args);
  }

  count(args?: Parameters<T["count"]>[0]) {
    return this.model.count(args);
  }
}
