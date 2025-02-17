<template>
  <div class="layout bg-color-blue" v-if="currentPairExists">
    <FDemoAppBar @exit="$emit('exit-demo')">
      <p v-if="!gameEnded" class="font-size-subtitle">Score: {{ realImageCounter }} / 10</p>
      <template #actions>
        <FLanguageSelector
          :locale="locale || 'en'"
          @update:locale="setLocale"
          class="locale-item"
        />
      </template>
    </FDemoAppBar>
    <div
      class="image-pair-container mx-xl"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <template v-if="!gameEnded">
        <div v-for="({ first, second }, index) in shuffledPairs" :key="index" class="image-pair">
          <div v-if="isImage(first)" class="image-wrapper">
            <div class="image">
              <img :src="first.url" class="rounded-s" @click="selectImage(first, index)" />
              <Transition>
                <CheckIcon
                  v-if="selectedPair === index && isSelectedReal(first)"
                  class="check-icon icon"
                  color="green"
                />
              </Transition>
              <Transition>
                <CrossIcon
                  v-if="selectedPair === index && !isSelectedReal(first)"
                  color="red"
                  class="cross-icon icon"
                />
              </Transition>
            </div>
            <p
              class="caption font-weight-medium font-size-body"
              :class="{ 'caption-visible': imageSelected }"
            >
              {{ first.caption }}
            </p>
          </div>
          <div v-else class="image-wrapper">
            <div class="image">
              <video
                :src="first.url"
                class="rounded-s"
                controls
                loop
                autoplay
                muted
                @touchstart="selectImage(first, index)"
                @click="
                  (e) => {
                    e.preventDefault()
                    selectImage(first, index)
                  }
                "
              />
              <Transition>
                <CheckIcon
                  class="check-icon icon"
                  v-if="selectedPair === index && isSelectedReal(first)"
                  color="green"
                />
              </Transition>
              <Transition>
                <CrossIcon
                  v-if="selectedPair === index && !isSelectedReal(first)"
                  color="red"
                  class="cross-icon icon"
                />
              </Transition>
            </div>
            <p
              class="caption font-weight-medium font-size-body"
              :class="{ 'caption-visible': imageSelected }"
            >
              {{ first.caption }}
            </p>
          </div>

          <div v-if="isImage(second)" class="image-wrapper">
            <div class="image">
              <img :src="second?.url" class="rounded-s" @click="selectImage(second, index)" />
              <Transition>
                <CheckIcon
                  v-if="selectedPair === index && isSelectedReal(second)"
                  class="check-icon icon"
                  color="green"
                />
              </Transition>
              <Transition>
                <CrossIcon
                  v-if="selectedPair === index && !isSelectedReal(second)"
                  color="red"
                  class="cross-icon icon"
                />
              </Transition>
            </div>
            <p
              class="caption font-weight-medium font-size-body"
              :class="{ 'caption-visible': imageSelected }"
            >
              {{ second.caption }}
            </p>
          </div>
          <div v-else class="image-wrapper">
            <div class="image">
              <video
                :src="second?.url"
                class="rounded-s"
                controls
                loop
                autoplay
                muted
                @touchstart="selectImage(second, index)"
                @click="
                  (e) => {
                    e.preventDefault()
                    selectImage(second, index)
                  }
                "
              />
              <Transition>
                <CheckIcon
                  class="check-icon icon"
                  v-if="selectedPair === index && isSelectedReal(second)"
                  color="green"
                />
              </Transition>
              <Transition>
                <CrossIcon
                  v-if="selectedPair === index && !isSelectedReal(second)"
                  color="red"
                  class="cross-icon icon"
                />
              </Transition>
            </div>
            <p
              class="caption font-weight-medium font-size-body"
              :class="{ 'caption-visible': imageSelected }"
            >
              {{ second.caption }}
            </p>
          </div>
        </div>
      </template>
    </div>
    <div v-if="gameEnded">
      <div class="image last-pic">
        <img src="/endgame3.jpg" class="rounded-s" />
        <div class="speech-bubble-text color-black font-size-body">
          <p class="font-weight-bold">{{ UITextContent.endGameText.title[locale] }}</p>
          <p>{{ UITextContent.endGameText.subtitle[locale] }} {{ realImageCounter }}</p>
        </div>
      </div>
    </div>

    <FButton
      v-if="!gameEnded"
      @click="nextPair"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      :label="
        currentIndex === shuffledPairs.length - 1
          ? UITextContent.finishButton[locale]
          : UITextContent.nextButton[locale]
      "
      class="mt-xl"
    />

    <FButton
      v-if="gameEnded"
      @click="$emit('exit-demo')"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      class="mt-xl"
      :label="UITextContent.homeButton[locale]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCMSstore } from '@/stores/cms'
import { FButton, FLanguageSelector, FDemoAppBar } from 'fari-component-library'
import CheckIcon from '@/components/CheckIcon.vue'
import CrossIcon from '@/components/CrossIcon.vue'
import type { Content } from '@/types'

const { real, fake, data, locale } = storeToRefs(useCMSstore())
const { setLocale } = useCMSstore()

const shuffledPairs = ref<{ first: Content; second: Content }[]>([])
const selectedPair = ref<number | null>(null)
const currentIndex = ref(0)
const realImageCounter = ref(0)
const imageSelected = ref(false)

const gameEnded = ref(false)

function shuffleAndPair(real: Content[], fake: Content[]) {
  const pairs: { first: Content; second: Content }[] = []

  for (let i = 0; i < real.length; i++) {
    const isRealFirst = Math.random() > 0.5
    pairs.push({
      first: isRealFirst ? real[i] : fake[i],
      second: isRealFirst ? fake[i] : real[i]
    })
  }

  return pairs
}

const lastPic = {
  url: '/endgame3.jpg'
}

const currentPair = computed(() => {
  return currentIndex.value < shuffledPairs.value.length
    ? [shuffledPairs.value[currentIndex.value]]
    : []
})

const currentPairExists = computed(() => currentPair.value.length > 0)

onMounted(() => {
  shuffledPairs.value = shuffleAndPair(real.value, fake.value)
})

function isSelectedReal(image: Content) {
  return real.value.includes(image)
}

function selectImage(image: Content, index: number) {
  selectedPair.value = index

  if (isSelectedReal(image)) realImageCounter.value++

  imageSelected.value = true
}

function nextPair() {
  if (currentIndex.value < shuffledPairs.value.length - 1) {
    selectedPair.value = null
    imageSelected.value = false
    currentIndex.value++
  } else {
    gameEnded.value = true
  }
}

function isImage(content: Content) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  const extension = content.url.split('.').pop()?.toLowerCase()
  return imageExtensions.includes(extension!)
}

const UITextContent = {
  startButton: {
    en: 'Start',
    'fr-FR': 'Commencer',
    nl: 'Begin'
  },
  nextButton: {
    en: 'Next',
    fr: 'Suivant',
    nl: 'Volgende'
  },
  finishButton: {
    en: 'Finish',
    fr: 'Finition',
    nl: 'Finish'
  },
  homeButton: {
    en: 'Back to home',
    nl: 'Terug naar de homepage',
    fr: "Retour à la page d'accueil"
  },
  endGameText: {
    title: {
      en: 'Thanks for playing!',
      fr: "Merci d'avoir joué !",
      nl: 'Bedankt voor het spelen!'
    },
    subtitle: {
      en: 'Your final score is',
      fr: 'Votre score final est',
      nl: 'Je eindscore is'
    }
  }
}
</script>
<style lang="css" scoped>
.layout {
  padding: 8rem 6.4rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  overflow: hidden;
  position: relative;
}

.font-size-subtitle {
  width: fit-content;
  margin-left: auto;
  margin-right: 46rem;
}
:deep(.language-selector) {
  color: white;
}
:deep(.dash) {
  color: white;
}
:deep(.selected) {
  color: white;
  font-weight: extrabold;
}

.app-bar {
  position: absolute;
  top: 2rem;
}

.image-pair-container {
  display: flex;
  align-items: center;
  width: 100vw;
  transition: transform 0.5s ease-in-out;
}

.image-pair {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-shrink: 0;
  width: 100vw;
}

.image {
  width: 600px;
  position: relative;
}

.icon {
  position: absolute;
  bottom: -1rem;
  right: -1rem;
}

img,
video {
  width: 600px;
  height: 600px;
  object-fit: cover;
  cursor: pointer;
  transition: border 0.3s ease;
}

.real-image {
  border: 5px solid #00a607;
}

.fake-image {
  border: 5px solid #f00;
}

.last-pic {
  position: relative;
}

.speech-bubble-text {
  width: 17rem;
  position: absolute;
  top: 6rem;
  right: 2rem;
  text-align: center;
}

.caption {
  position: absolute;
  top: 39rem;
  opacity: 0;
  transition: all 0.2s ease-in;
  width: 600px;
}

.caption-visible {
  opacity: 1;
}

.caption-last {
  text-align: center;
  font-weight: bold;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
