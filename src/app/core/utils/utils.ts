import { interval, of, Subscription, switchMap, takeUntil, takeWhile, timer } from "rxjs";
import { PlayerEventType } from "../constant/event-type";
import { ElementRef } from "@angular/core";


interface FnParam {
    fn: any;
    param: any;
}


type MapOfRegisteredListenersPerElement = Map<any, Map<string, Array<(...args: any[]) => void>>>;


export class Utils {

    public static isArrayLike = (<T>(x: any): x is ArrayLike<T> => x && typeof x.length === 'number' && typeof x !== 'function');

    private static isFnParam(obj: any): obj is FnParam {
        return obj && typeof obj === 'object' && 'fn' in obj && 'param' in obj;
    }

    public static mapOfRegisteredListenersPerTarget: Map<any, MapOfRegisteredListenersPerElement> = new Map();

    private static callFunctionWithParam(functionWithParam: any) {
        if (functionWithParam) {
            if (Utils.isFnParam(functionWithParam)) {
                functionWithParam.fn(functionWithParam.param);
            } else {
                functionWithParam();
            }
        }
    }


    public static waitFor(conditionFn: any, nextActionFn?: any, completeActionFn?: any, intervalStep?: number, timeout?: number, setDataLoadingFn?: any): Subscription {
        setDataLoadingFn && setDataLoadingFn(true);
        const _timeout = timeout ?? 30000;
        const _intervalStep = intervalStep ?? 5;
        return interval(_intervalStep).pipe(// Vérifier toutes les _intervalStep millisecondes
            switchMap(() => of(conditionFn())), takeWhile(conditionMet => !conditionMet, true) // Continuer tant que la condition n'est pas vérifiée
            , takeUntil(timer(_timeout))).subscribe({
                next: () => {
                    Utils.callFunctionWithParam(nextActionFn);
                },
                complete: () => {
                    Utils.callFunctionWithParam(completeActionFn);
                    setDataLoadingFn && setDataLoadingFn(false);
                }
            });
    }

    public static addListener(target: any, elementOnTarget: any, playerEventType: string, funcOnTarget: any) {
        //On récupère la map des event listeners propres à target qui est une instance d'une classe ou d'un composant
        const mapOfListenersPerElement: MapOfRegisteredListenersPerElement = Utils.mapOfRegisteredListenersPerTarget.get(target) ?? new Map();
        //On récupère ensuite la map des event listeners propres à un élément (html element, document, window) ou à un eventEmitter
        const mapOfListeners: Map<string, Array<(...args: any[]) => void>> = mapOfListenersPerElement.get(elementOnTarget) ?? new Map();
        //On récupère la liste des fonctions cad les event listeners
        let listOfInitFunctions = mapOfListeners.get(playerEventType) ?? [];
        const boundFuncOnTarget = funcOnTarget.bind(target);
        let funcOnTargetAlreadyAdded = false;
        listOfInitFunctions.forEach(boundFunc => {
            if (boundFuncOnTarget.name === boundFunc.name) {
                funcOnTargetAlreadyAdded = true;
            }
        });
        if (!funcOnTargetAlreadyAdded) {
            listOfInitFunctions.push(boundFuncOnTarget);
            mapOfListeners.set(playerEventType, listOfInitFunctions);
            mapOfListenersPerElement.set(elementOnTarget, mapOfListeners);
            Utils.mapOfRegisteredListenersPerTarget.set(target, mapOfListenersPerElement);
            if (typeof elementOnTarget.on === 'function') {
                elementOnTarget.on(playerEventType, boundFuncOnTarget);
            } else if (typeof elementOnTarget.addListener === 'function') {
                elementOnTarget.addListener(playerEventType, boundFuncOnTarget);
            } else if (typeof elementOnTarget.addEventListener === 'function') {
                elementOnTarget.addEventListener(playerEventType, boundFuncOnTarget);
            }
        }
    }

    private static unsubscribeTargetEventListeners(target) {
        const mapOfListenersPerElement: MapOfRegisteredListenersPerElement = Utils.mapOfRegisteredListenersPerTarget.get(target);
        mapOfListenersPerElement && mapOfListenersPerElement.forEach((mapOfListeners, elementOnTarget, map) => {
            mapOfListeners.forEach((listOfFunctions, eventType) => {
                listOfFunctions.forEach((func) => {
                    if (typeof elementOnTarget.off === 'function') {
                        elementOnTarget.off(eventType, func);
                    } else if (typeof elementOnTarget.removeListener === 'function') {
                        elementOnTarget.removeListener(eventType, func);
                    } else {
                        elementOnTarget.removeEventListener(eventType, func);
                    }
                });
            });
            mapOfListeners.clear();
            map.delete(elementOnTarget);
        });
        Utils.mapOfRegisteredListenersPerTarget.delete(target);
    }

    private static unsubscribeEventTypeFromElementOnTarget(mapOfListeners: Map<string, Array<(...args: any[]) => void>>, playerEventType: string, elementOnTarget: any) {
        const listOfFunctions = mapOfListeners.get(playerEventType);
        if (listOfFunctions) {
            listOfFunctions.forEach(func => {
                if (typeof elementOnTarget.off === 'function') {
                    elementOnTarget.off(playerEventType, func);
                } else if (typeof elementOnTarget.removeListener === 'function') {
                    elementOnTarget.removeListener(playerEventType, func);
                } else {
                    elementOnTarget.removeEventListener(playerEventType, func);
                }
            });
            mapOfListeners.delete(playerEventType);
        }
    }

    private static unsubscribeAllEventTypesFromElementOnTarget = (mapOfListeners: Map<string, Array<(...args: any[]) => void>>, elementOnTarget: any) => {
        mapOfListeners.forEach((listOfFunctions, eventType) => {
            listOfFunctions.forEach((func) => {
                if (typeof elementOnTarget.off === 'function') {
                    elementOnTarget.off(eventType, func);
                } else if (typeof elementOnTarget.removeListener === 'function') {
                    elementOnTarget.removeListener(eventType, func);
                } else if (typeof elementOnTarget.removeEventListener === 'function') {
                    elementOnTarget.removeEventListener(eventType, func);
                }
            });
        });
        mapOfListeners.clear();
    }

    public static unsubscribeTargetedElementEventListeners(target: any, elementOnTarget?: any, playerEventType?: PlayerEventType) {
        const mapOfListenersPerElement: MapOfRegisteredListenersPerElement = Utils.mapOfRegisteredListenersPerTarget.get(target);
        if (mapOfListenersPerElement) {
            if (elementOnTarget) {
                const mapOfListeners = mapOfListenersPerElement.get(elementOnTarget);
                if (mapOfListeners) {
                    if (playerEventType) {
                        Utils.unsubscribeEventTypeFromElementOnTarget(mapOfListeners, playerEventType, elementOnTarget);
                    } else {
                        Utils.unsubscribeAllEventTypesFromElementOnTarget(mapOfListeners, elementOnTarget);
                    }
                }
            } else {
                Utils.unsubscribeTargetEventListeners(target);
            }
        }
    }
    public static isInComposedPath(htmlElementId: string, event: any): boolean {
        return event.composedPath().some((pathElement: any) => pathElement.id === htmlElementId);
    }

    public static getShadowRoot(elementRef: any | undefined): ShadowRoot | undefined {
        if (!elementRef) return undefined;
        let node = elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;
        while (node) {
            if (node.nodeType == 11) {
                return node;
            }
            node = node.parentNode;
        }
        return undefined;
    }
}


