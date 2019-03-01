export function assign<T>(target: T, ...sources: Partial<T>[]): T {
    return Object.assign({}, target, ...sources);
}
