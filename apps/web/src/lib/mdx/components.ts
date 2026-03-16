import { AnimationPlaceholder } from '@/components/lesson-blocks/AnimationPlaceholder'
import { InteractiveExercise } from '@/components/lesson-blocks/InteractiveExercise'
import { QuizBlock } from '@/components/lesson-blocks/QuizBlock'

import { PlaceholderAnimation } from '@/components/lesson-blocks/PlaceholderAnimation'

export const mdxComponents = {
  AnimationPlaceholder,
  InteractiveExercise,
  QuizBlock,

  // Canonical animation component tags (placeholders for demo)
  GlobalFlowMap: PlaceholderAnimation,
  TradeMechanicDemo: PlaceholderAnimation,
  MarketParticipantsPyramid: PlaceholderAnimation,
  MarketHierarchyPyramid: PlaceholderAnimation,
  StopHuntSequence: PlaceholderAnimation,
  PairAnatomyDissection: PlaceholderAnimation,
  PairsClassificationMap: PlaceholderAnimation,
  PairSelector: PlaceholderAnimation,
}

