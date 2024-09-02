import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

// import type {
//   DrawGridRequest,
//   DrawGridResponse,
//   PlayMoveRequest,
//   PlayMoveResponse
// } from '@/types/Game'

const baseUrl = 'http://46.226.110.124:1337'
const mediaUrl = `${baseUrl}/api/whichcontentisreal-mediacontents`

const app = express()
const PORT = 3000
dotenv.config()

const strapiURL = process.env.API_URL
const EXTERNAL_API_BASE_URL = 'http://127.0.0.1'

interface Attributes {
  locale: string
  logo: string
  research_head: string
  research_lead: string
  explanation_short: {
    en: string
    nl: string
    'fr-FR': string
  }
}

app.use(cors())
app.use(bodyParser.json())

app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${baseUrl}/api/demos/43?populate=*`)
    const { data } = await response.json()
    const { localizations, explanation_short, research_head, research_lead } = data.attributes
    const locales = localizations.data.map(({ attributes }: { attributes: Attributes }) => ({
      locale: attributes.locale,
      explanation_short: attributes.explanation_short
    }))
    const content = [
      { research_head, research_lead },
      { locale: 'en', explanation_short },
      ...locales
    ]
    res.send(content)
  } catch (error) {
    console.error({ error })
    res.status(500).send('Error fetching data from Strapi')
  }
})

app.get('/media', async (req: Request, res: Response) => {
  try {
    const content = await getMedia(mediaUrl, 10)

    res.send(content)
  } catch (error) {
    console.error({ error })
    res.status(500).send('Error fetching data from Strapi')
  }
})

async function getMedia(mediaUrl, mediaAmount) {
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

app.listen(PORT, () => console.info(`Server is running on http://localhost:${PORT}`))
