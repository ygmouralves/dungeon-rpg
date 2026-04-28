type Factory<T> = () => T;

export class Container {
  private readonly _singletons = new Map<string, unknown>();
  private readonly _factories = new Map<string, Factory<unknown>>();

  singleton<T>(token: string, factory: Factory<T>): this {
    this._factories.set(token, factory as Factory<unknown>);
    return this;
  }

  transient<T>(token: string, factory: Factory<T>): this {
    this._factories.set(`transient:${token}`, factory as Factory<unknown>);
    return this;
  }

  resolve<T>(token: string): T {
    const transientKey = `transient:${token}`;
    if (this._factories.has(transientKey)) {
      return (this._factories.get(transientKey) as Factory<T>)();
    }

    if (!this._singletons.has(token)) {
      const factory = this._factories.get(token);
      if (!factory) throw new Error(`Container: token "${token}" not registered.`);
      this._singletons.set(token, factory());
    }

    return this._singletons.get(token) as T;
  }
}
