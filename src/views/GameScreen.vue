<template>
  <div class="layout bg-color-blue mt-md" v-if="currentPairExists">
    <ToolBar class="toolbar">
      <template #left>
        <div class="container-left">
          <ChevronLeft @click="$emit('exit-demo')" color="white" />
        </div>
      </template>

      <template #center>
        <p class="font-size-subtitle">Score: {{ realImageCounter }}</p>
      </template>
    </ToolBar>

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
        <img :src="lastPic.url" class="rounded-s" />
        <div class="speech-bubble-text color-black font-size-body">
          <p class="font-weight-bold">Thanks for playing!</p>
          <p>You scored {{ realImageCounter }}</p>
        </div>
      </div>
    </div>

    <FButton
      v-if="!gameEnded"
      @click="nextPair"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      :label="currentIndex === shuffledPairs.length - 1 ? 'Finish game' : 'Next'"
      class="mt-xl"
    />

    <FButton
      v-if="gameEnded"
      @click="$emit('exit-demo')"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      class="mt-xl"
      label="Back to home"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { FButton } from 'fari-component-library'
import ToolBar from '@/components/ToolBar.vue'
import ChevronLeft from '@/components/ChevronLeft.vue'
import CheckIcon from '@/components/CheckIcon.vue'
import CrossIcon from '@/components/CrossIcon.vue'

type Content = { url: string; caption: string }

const { real, fake } = storeToRefs(useGameStore())
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
  url: 'src/assets/endgame2.jpg'
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

.toolbar {
  position: absolute;
  top: 0;
  width: 100vw;
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
  position: absolute;
  top: 6rem;
  right: 5rem;
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
