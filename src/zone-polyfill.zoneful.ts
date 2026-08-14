// Variante `zoneful` (configuration de secours d'angular.json, phase 9 du plan perf) :
// recharge zone.js, couplée à environment.zoneful.ts (zoneless: false) pour rebasculer
// sur provideZoneChangeDetection. Conservée le temps d'une release après le flip.
import 'zone.js';
