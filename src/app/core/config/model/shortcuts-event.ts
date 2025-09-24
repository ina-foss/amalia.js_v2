export type ShortcutEventTarget = 'CONTROL_BAR' | 'ANNOTATIONS' | 'TRANSCRIPTION' | 'TIMELINE' | 'STORYBOARD' | 'HISTOGRAM' | 'TIME_BAR' | 'SUBTITLE';

export interface ShortcutEvent {
    shortcut: Shortcut;
    targets?: Array<ShortcutEventTarget>;
}

export interface ShortcutControl {
    shortcut: Shortcut;
    control: string;
}

export interface Shortcut {
    key: string;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
}

export function matchesShortcut(shortcutControl: ShortcutControl, shorCut: Shortcut): boolean {
    return shortcutControl.shortcut.key === shorCut.key &&
        shortcutControl.shortcut.ctrl === shorCut.ctrl &&
        shortcutControl.shortcut.shift === shorCut.shift &&
        shortcutControl.shortcut.alt === shorCut.alt &&
        shortcutControl.shortcut.meta === shorCut.meta;
}