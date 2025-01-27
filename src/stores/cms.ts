import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MediaPair, Content, Locale } from '../types'
import { fetchDirectus } from 'fari-directus-parser'
import { createDirectus, rest, readItems } from '@directus/sdk'

export const useCMSstore = defineStore('cms', () => {
  const locale = ref<Locale>('en')
  const data = ref<unknown | null>(null)
  const loading = ref(false)
  const error = ref(null)
  const real = ref<Content[]>([])
  const fake = ref<Content[]>([])

  async function getData() {
    data.value = await fetchDirectus({ slug: 'which-content-is-real' })

    const media = await fetchMediaPairs()
    const organizedMedia = organizeMediaPairs(media as MediaPair[])

    real.value = organizedMedia.real
    fake.value = organizedMedia.fake
  }
  const setLocale = (l: Locale) => (l === 'fr-FR' ? (locale.value = 'fr') : (locale.value = l))

  return {
    locale,
    setLocale,
    data,
    loading,
    error,
    getData,
    real,
    fake
  }
})

async function fetchMediaPairs() {
  const client = createDirectus('https://fari-cms.directus.app').with(rest())
  const response = await client.request(
    readItems('whichContentIsRealMediaPairs', {
      fields: ['*.*']
    })
  )
  return response
}

function organizeMediaPairs(media: MediaPair[]) {
  const ITEM_COUNT = 10
  const BASE_URL = 'https://fari-cms.directus.app/assets/'

  const length = Math.min(ITEM_COUNT, media.length)

  const real = [] as Content[]
  const fake = [] as Content[]

  const shuffled = shuffle(media)

  for (let i = 0; i < length; i++) {
    const item = shuffled[i]

    real.push({
      url: BASE_URL + item.realContent.filename_disk,
      caption: item.realContent.description || ''
    })
    fake.push({
      url: BASE_URL + item.fakeContent.filename_disk,
      caption: item.fakeContent.description || ''
    })
  }

  return {
    real,
    fake
  }
}

function shuffle(array: MediaPair[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
