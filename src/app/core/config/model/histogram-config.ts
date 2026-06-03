/**
 * Configuration for the wavesurfer-based histogram plugin.
 *
 * The waveform peaks (`{posbins, negbins}`) are loaded by the standard amalia
 * {@link MetadataManager} via a `dataSource` registered at the player level.
 * The plugin reads the resulting {@link Metadata} block whose `id` is referenced
 * by `pluginConfiguration.metadataIds[0]` and expects its `data` property to
 * carry the peaks payload.
 */
export interface HistogramConfig {
    /**
     * Number of zero bins prepended to each channel before passing peaks to wavesurfer.
     * Defaults to 32 to match the reference implementation.
     */
    padPeaks?: number;
    /**
     * When true, the zoom plugin is disabled (used when a spectrogram is rendered alongside).
     */
    withSpectrogram?: boolean;
    /**
     * Wavesurfer waveform color. Default: `rgb(54,76,97)`.
     */
    waveColor?: string;
    /**
     * Wavesurfer progress color (played portion). Default: same as waveColor.
     */
    progressColor?: string;
    /**
     * Minimap waveform color (unplayed portion). Default: `waveColor`.
     */
    minimapWaveColor?: string;
    /**
     * Minimap progress color (played portion). Default: `progressColor`.
     */
    minimapProgressColor?: string;
    /**
     * Minimap selection overlay color. Default: `rgba(100,100,100,0.5)`.
     */
    minimapOverlayColor?: string;
    /**
     * Wavesurfer cursor color. Default: `#ffffff`.
     */
    cursorColor?: string;
    /**
     * Wavesurfer minimum pixels per second. Default: 20 (180 with spectrogram).
     */
    minPxPerSec?: number;
    /**
     * Minimap height in px. Default: 30.
     */
    minimapHeight?: number;
    /**
     * When true, the histogram reserves space for pinned control-bar states
     * (same visual behavior as video mode). Enabled by default.
     */
    enableControlBarSync?: boolean;
    /**
     * When true, histogram time updates are slightly throttled to reduce
     * visual flicker/stroboscopic effect. Enabled by default.
     */
    enableStrobeReduction?: boolean;
}
