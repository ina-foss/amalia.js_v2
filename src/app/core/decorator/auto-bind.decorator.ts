/**
 * Decorator in charge to remove bind(this) syntax
 * @param target main target element
 * @param methodName method name
 * @param descriptor parameter
 */
export function AutoBind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(): any {
            return originalMethod.bind(this);
        }
    };
    return adjDescriptor;
}

