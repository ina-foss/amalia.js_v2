// Flip zoneless (phase 9, PLAN-PERF-2026.md) : zone.js n'est plus chargé — la change
// detection est pilotée par les signals et le scheduler zoneless. La configuration de
// secours `zoneful` d'angular.json remplace ce module par zone-polyfill.zoneful.ts
// (fileReplacements) pour re-livrer un bundle zoné sans modifier le code.
// NE PAS utiliser l'option `polyfills` d'angular.json pour recharger zone.js : le builder
// émettrait un polyfills.js séparé, en violation du contrat mono-fichier.
export {};
