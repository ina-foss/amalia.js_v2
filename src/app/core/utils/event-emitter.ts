/**
 * EventEmitter minimal compatible avec l'API Node utilisée par le player
 * (on / off / addListener / removeListener / emit / setMaxListeners).
 *
 * Remplace `import { EventEmitter } from 'events'` : le builder esbuild
 * (@angular/build:application) ne résout pas les builtins Node pour le
 * navigateur, et le player n'a besoin que de ce sous-ensemble.
 *
 * Sémantique Node conservée :
 * - les listeners d'un événement sont appelés dans l'ordre d'inscription ;
 * - `emit` itère sur une copie de la liste (un off pendant l'émission ne
 *   décale pas l'itération en cours) ;
 * - les doublons sont autorisés ; `off` ne retire que la première occurrence.
 */
export class EventEmitter {
    private readonly listenersByEvent = new Map<string | symbol, Array<(...args: any[]) => void>>();
    private maxListeners = 10;

    public on(eventType: string | symbol, listener: (...args: any[]) => void): this {
        const listeners = this.listenersByEvent.get(eventType);
        if (listeners) {
            listeners.push(listener);
        } else {
            this.listenersByEvent.set(eventType, [listener]);
        }
        return this;
    }

    public addListener(eventType: string | symbol, listener: (...args: any[]) => void): this {
        return this.on(eventType, listener);
    }

    public off(eventType: string | symbol, listener: (...args: any[]) => void): this {
        const listeners = this.listenersByEvent.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    this.listenersByEvent.delete(eventType);
                }
            }
        }
        return this;
    }

    public removeListener(eventType: string | symbol, listener: (...args: any[]) => void): this {
        return this.off(eventType, listener);
    }

    public removeAllListeners(eventType?: string | symbol): this {
        if (eventType === undefined) {
            this.listenersByEvent.clear();
        } else {
            this.listenersByEvent.delete(eventType);
        }
        return this;
    }

    public emit(eventType: string | symbol, ...args: any[]): boolean {
        const listeners = this.listenersByEvent.get(eventType);
        if (!listeners || listeners.length === 0) {
            return false;
        }
        for (const listener of listeners.slice()) {
            listener.apply(this, args);
        }
        return true;
    }

    public listenerCount(eventType: string | symbol): number {
        return this.listenersByEvent.get(eventType)?.length ?? 0;
    }

    /**
     * Compat API Node : le plafond n'est pas contraignant ici (pas de warning
     * MaxListenersExceededWarning côté navigateur), la valeur est conservée
     * pour les appelants existants.
     */
    public setMaxListeners(max: number): this {
        this.maxListeners = max;
        return this;
    }

    public getMaxListeners(): number {
        return this.maxListeners;
    }
}
