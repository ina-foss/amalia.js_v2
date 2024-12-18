import {AutoBind} from "../decorator/auto-bind.decorator";
import {interval, of, Subscription, switchMap, takeUntil, takeWhile, timer} from "rxjs";

interface FnParam {
    fn: any;
    param: any;
}

export class Utils {

    public static isArrayLike = (<T>(x: any): x is ArrayLike<T> => x && typeof x.length === 'number' && typeof x !== 'function');

    private static isFnParam(obj: any): obj is FnParam {
        return obj && typeof obj === 'object' && 'fn' in obj && 'param' in obj;
    }

    private static callFunctionWithParam(functionWithParam: any) {
        if (functionWithParam) {
            if (Utils.isFnParam(functionWithParam)) {
                functionWithParam.fn(functionWithParam.param);
            } else {
                functionWithParam();
            }
        }
    }

    @AutoBind
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


}


