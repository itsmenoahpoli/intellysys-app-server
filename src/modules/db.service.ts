export type PrismaModelDelegate = {
  findMany: (args?: unknown) => Promise<unknown>;
  findFirst: (args?: unknown) => Promise<unknown>;
  findUnique: (args?: unknown) => Promise<unknown>;
  findUniqueOrThrow: (args?: unknown) => Promise<unknown>;
  findFirstOrThrow: (args?: unknown) => Promise<unknown>;
  create: (args?: unknown) => Promise<unknown>;
  createMany: (args?: unknown) => Promise<unknown>;
  update: (args?: unknown) => Promise<unknown>;
  updateMany: (args?: unknown) => Promise<unknown>;
  upsert: (args?: unknown) => Promise<unknown>;
  delete: (args?: unknown) => Promise<unknown>;
  deleteMany: (args?: unknown) => Promise<unknown>;
  count: (args?: unknown) => Promise<number>;
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
