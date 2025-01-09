export type MediaContent = {
  id: string
  filename_disk: string
  title: string
  description: string
}

export type MediaPair = {
  realContent: MediaContent
  fakeContent: MediaContent
  type: string
}

export type Content = { url: string; caption: string }

export type Locale = 'en' | 'fr-FR' | 'fr' | 'nl'
