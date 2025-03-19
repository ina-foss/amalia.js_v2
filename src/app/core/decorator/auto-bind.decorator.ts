const getAdjDescriptor = (methodName: string, originalMethod) => {
    return {
        configurable: true,
        enumerable: false,
        get() {
            if (!this.boundMethodsMap) {
                this.boundMethodsMap = new Map();
            }
            let boundFn = this.boundMethodsMap.get(methodName);
            if (!boundFn) {
                boundFn = originalMethod.bind(this);
                this.boundMethodsMap.set(methodName, boundFn);
            }
            Object.defineProperty(this, methodName, {
                value: boundFn,
                configurable: true,
                enumerable: false,
                writable: true
            });
            return boundFn;
        }
    };
}

/**
 * Decorator in charge to remove bind(this) syntax
 * @param target main target element
 * @param methodName method name
 * @param descriptor parameter
 */
export function AutoBind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let adjDescriptor: PropertyDescriptor;
    if (target) {
        if (!target.boundDescriptorsMap) {
            target.boundDescriptorsMap = new Map();
        }
        let adjDescriptor = target.boundDescriptorsMap.get(methodName);
        if (!adjDescriptor) {
            adjDescriptor = getAdjDescriptor.call(this, methodName, originalMethod);
            target.boundDescriptorsMap.set(methodName, adjDescriptor);
        }
        return adjDescriptor;
    }
    adjDescriptor = getAdjDescriptor.call(this, methodName, originalMethod);
    return adjDescriptor;
}

