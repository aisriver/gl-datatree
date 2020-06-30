import 'core-js';
export default class RAF {
    private _timerIdMap;
    constructor();
    private run;
    private setIdMap;
    setTimeout(cb: () => void, interval: number): symbol;
    clearTimeout(timer: symbol): void;
    setInterval(cb: () => void, interval: number): symbol;
    clearInterval(timer: symbol): void;
}
