import type { ChapterDef } from "./types";
import ColdopenChapter from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import LandscapeChapter from "../chapters/02-landscape/Landscape";
import { narrations as landscapeNarrations } from "../chapters/02-landscape/narrations";
import ModelEvolutionChapter from "../chapters/03-model-evolution/ModelEvolution";
import { narrations as modelEvolutionNarrations } from "../chapters/03-model-evolution/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "coldopen",
    title: "开场钩子",
    narrations: coldopenNarrations,
    Component: ColdopenChapter,
  },
  {
    id: "landscape",
    title: "厂商全景",
    narrations: landscapeNarrations,
    Component: LandscapeChapter,
  },
  {
    id: "model-evolution",
    title: "模型版本演变",
    narrations: modelEvolutionNarrations,
    Component: ModelEvolutionChapter,
  },
];