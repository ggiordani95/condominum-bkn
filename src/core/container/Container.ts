export class Container {
  private services: Map<string, any> = new Map();

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }

  public register<T>(serviceName: string, service: T): void {
    this.services.set(serviceName, service);
  }

  public has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  public clear(): void {
    this.services.clear();
  }
}

// Singleton instance
export const container = new Container();
