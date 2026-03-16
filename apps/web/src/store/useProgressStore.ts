'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressStore {
  completedLessons: string[]
  markComplete: (lessonId: string) => void
  isComplete: (lessonId: string) => boolean
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      markComplete: (lessonId) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        })),
      isComplete: (lessonId) => get().completedLessons.includes(lessonId),
    }),
    { name: 'tc-progress' }
  )
)

