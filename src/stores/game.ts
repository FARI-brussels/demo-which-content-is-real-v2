import { defineStore } from 'pinia'
import type { Locale } from '../types/Locale'

const baseUrl = 'http://46.226.110.124:1337'
const mediaUrl = `${baseUrl}/api/whichcontentisreal-mediacontents`

interface LocalizedAttributes {
  locale: Locale;
  explanation_short: string;
}

interface DataAttributes {
  localizations: {
    data: { attributes: LocalizedAttributes }[];
  };
  research_head: string;
  research_lead: string;
  logo?: string;
  explanation_short: string;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    loading: false,
    error: null as null | string,
    CMS: {
      locale: 'en',
      data: {
        logo: '',
        title: {
          en: 'Which content is real?',
          'fr-FR': 'Quel contenu est réel ?',
          nl: 'Welke inhoud is echt?'
        },
        subtitle: {
          en: 'AI Education',
          'fr-FR': 'Éducation en IA',
          nl: 'AI-onderwijs'
        },
        startButton: {
          en: 'Start',
          'fr-FR': 'Commencer',
          nl: 'Begin'
        },
        nextButton: {
          en: 'Next',
          'fr-FR': 'Suivant',
          nl: 'Volgende'
        },
        finishButton: {
          en: 'Finish',
          'fr-FR': 'Finition',
          nl: 'Finish'
        },
        homeButton: {
          en: 'Back to home',
          nl: 'Terug naar de homepage',
          'fr-FR': "Retour à la page d'accueil"
        },
        endGameText: {
          title: {
            en: 'Thanks for playing!',
            'fr-FR': "Merci d'avoir joué !",
            nl: 'Bedankt voor het spelen!'
          },
          subtitle: {
            en: 'Your final score is',
            'fr-FR': 'Votre score final est',
            nl: 'Je eindscore is'
          }
        },
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
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${baseUrl}/api/demos/43?populate=*`);
        if (!response.ok) {
          throw new Error('Failed to fetch CMS data');
        }

        const { data } = await response.json();
        const attributes: DataAttributes = data.attributes;
        const { localizations, research_head, research_lead, logo, explanation_short } = attributes;

        const locales: LocalizedAttributes[] = localizations.data.map(
          ({ attributes }: { attributes: LocalizedAttributes }) => ({
            locale: attributes.locale,
            explanation_short: attributes.explanation_short,
          })
        );

        const content = [
          { locale: 'en', explanation_short, research_head, research_lead, logo },
          ...locales,
        ];

        content.forEach((item) => {
          const { research_head, research_lead, logo, locale, explanation_short } = item;
          console.log({ research_head, research_lead, logo, locale, explanation_short })
          if (logo) this.CMS.data.logo = logo;
          if (research_head) this.CMS.data.research_head = research_head;
          if (research_lead) this.CMS.data.research_lead = research_lead;
          if (locale) this.CMS.data.explanation_short[locale] = explanation_short;
        });
      } catch (error) {
        this.error = 'Error fetching data';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getMedia() {
      const response = await fetchMedia(mediaUrl, 10)
      const { real, fake } = response
      this.real = real
      this.fake = fake
    },
    setLocale(locale: Locale): any {
      this.CMS.locale = locale
    }
  }
})


async function fetchMedia(mediaUrl, mediaAmount) {
  const data = await fetch(`${mediaUrl}?populate=*`).then((response) => response.json())
  shuffle(data.data)
  type Content = { url: string; caption: string }
  const real = [] as Content[]
  const fake = [] as Content[]

  const length = Math.min(mediaAmount, data.data.length)

  for (let i = 0; i < length; i++) {
    const item = data.data[i]
    real.push({
      url: baseUrl + item.attributes.realContent.data.attributes.url,
      caption: item.attributes.realContent.data.attributes.caption || ''
    })
    fake.push({
      url: baseUrl + item.attributes.fakeContent.data.attributes.url,
      caption: item.attributes.fakeContent.data.attributes.caption || ''
    })
  }

  return {
    real,
    fake
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
  }
  return array
}