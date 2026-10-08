import { stageFromHash, type StageId } from "./stages";
import { createStore } from "./store";

/** المرحلة الظاهرة. القيمة الأولى من الـ hash (نفس مصدر الـ boot script)، والـ router (المرحلة 06) بيغيّرها */
export const stageStore = createStore<StageId>(
  typeof window === "undefined" ? "home" : stageFromHash(window.location.hash),
);
