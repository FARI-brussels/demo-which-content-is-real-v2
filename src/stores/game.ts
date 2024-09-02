import { defineStore } from 'pinia'
import type { Locale } from '../types/Locale'
// import type {
//   DrawGridRequest,
//   DrawGridResponse,
//   PlayMoveRequest,
//   PlayMoveResponse,
//   GameState,
//   Player,
//   HumanPlayer,
//   RobotPlayer
// } from '../types/Game'

export const useGameStore = defineStore('game', {
  state: () => ({
    loading: false,
    error: null as null | string,
    CMS: {
      locale: 'en',
      data: {
        logo: '',
        research_head: '',
        research_lead: '',
        explanation_short: {
          en: '',
          'fr-FR': '',
          nl: ''
        }
      }
    },
    real: [],
    fake: []
  }),
  actions: {
    async getCMSData() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('http://localhost:3000/api/data')
        const parsed = await response.json()

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        parsed.forEach((e: { [k: string]: string }) => {
          const { research_head, research_lead, logo, locale, explanation_short } = e

          if (logo) this.CMS.data.logo = logo
          if (research_head) this.CMS.data.research_head = research_head
          if (research_lead) this.CMS.data.research_lead = research_lead
          if (locale) this.CMS.data.explanation_short[locale as Locale] = explanation_short
        })
      } catch (error) {
        this.error = 'Error fetching data'
      } finally {
        this.loading = false
      }
    },

    async getMedia() {
      const response = await fetch('http://localhost:3000/media')
      const parsed = await response.json()
      const { real, fake } = parsed
      this.real = real
      this.fake = fake
    },
    setLocale(locale: Locale): any {
      this.CMS.locale = locale
    }
  }
})
