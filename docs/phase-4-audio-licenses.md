# Phase4 audio asset manifest — original procedural sound, no downloaded stock assets

No downloaded sound has been added during this continuation. No commercial license has been assumed or copied from reference recordings. The former independent control/reaction AudioContexts are replaced by one opt-in engine in `src/world/audio/audio-engine.ts` and `WorldAudio.tsx`.

| Sound | Source / author | Rights and attribution | File size | Usage |
|---|---|---|---|---|
| Wind/city noise | Original deterministic synthesis in audio-engine.ts, this implementation | Original code; no third-party recording or attribution obligation | No audio file; shared four-second mono buffer allocated after opt-in | Quiet global filtered ambience, city level reduced at night |
| Pool/water noise | Same original synthesis | Same | No downloaded file | HRTF panner at actual Companies pool anchor |
| Rotor texture | Same original synthesis | Same | No downloaded file | HRTF panner follows canonical helicopter pose; reduced idle level |
| UI cues | Original oscillator sweeps; retained reaction mappings | Same | No audio file | Short disconnected-on-end interaction tones |

This is a procedural audio foundation, not a claim of realistic recorded traffic, bird calls, horns, or a complete stock soundscape. Off by default; only the Sound button initializes/resumes the context. Mute suspends it, visibilitychange suspends hidden tabs, scene teardown stops/disconnects sources and closes the context. Volume is session-only; enable preference is deliberately not restored automatically. Browser/listening/visibility acceptance remains open. Full tests for supported-browser audio lifecycle are still required.

For each future asset record filename, exact original source URL, author, exact license, attribution text/requirement, bytes and intended emitter. Research actual per-asset license on Mixkit/Freesound, not a blanket site assumption. Do not commit an asset with unclear reuse rights.

Future engine must be opt-in/off by default, single coordinated listener/master gain, bounded loops with real spatial attenuation, hidden-tab suspension, clean teardown and graceful browser fallback. These are required behavior, not verified current capability claims.

## Research update 2026-10-09 — no assets installed

Candidate: `Helicopter Rotor Loop.flac`, author qubodup, original https://freesound.org/people/qubodup/sounds/187681/ . Actual item page inspected: Creative Commons0,6.318s,stereo48kHz16bit,reported388.9KB. Attribution not required by CC0; author recommends a source link. Intended use: low-volume positional rotor loop synchronized with actual helicopter lifecycle. Original download requires login; no file downloaded, converted, committed or played. Local filename/actual bytes remain unavailable, so this is a research candidate, not an integrated-asset manifest entry.

Mixkit's actual Sound Effects Free License inspected at https://mixkit.co/license/modal/sfxFree/ . Commercial end products are permitted but redistribution with source files is prohibited. Do not add Mixkit stock files to this public-source repository without resolving that restriction. No individual Mixkit file is selected or licensed by this report.

Current source audit: UI reaction cues now use the same master/context as the optional spatial emitters. License research alone does not satisfy T22, and the procedural foundation is not acceptance of the complete requested soundscape.

## Authoritative continuation update — 2026-10-09

Latest validation: original opt-in engine lifecycle tests now run, including one context, mute/resume, hidden-tab suspension and disposal of four loops. Browser Sound on/off and volume availability verified. No downloaded stock assets. Actual listening quality/real tab-hide behavior remain unverified; realistic birds/horns/passing vehicles are not implemented. This supersedes earlier wording that lifecycle tests were wholly absent.
