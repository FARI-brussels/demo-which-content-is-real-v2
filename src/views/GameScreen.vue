<template>
  <div class="layout bg-color-blue" v-if="currentPairExists">
    <p class="font-size-subtitle">Score: {{ realImageCounter }}</p>
    <div
      class="image-pair-container mx-xl"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="({ first, second }, index) in shuffledPairs" :key="index" class="image-pair">
        <div v-if="isImage(first)" class="image">
          <img
            :src="first.url"
            class="rounded-s"
            :class="{
              'real-image': selectedPair === index && isSelectedReal(first),
              'fake-image': selectedPair === index && !isSelectedReal(first)
            }"
            @click="selectImage(first, index)"
          />
          <p
            class="caption font-weight-medium font-size-body"
            :class="{ 'caption-visible': imageSelected }"
          >
            {{ first.caption }}
          </p>
        </div>
        <div v-else class="image">
          <video
            :src="first.url"
            class="rounded-s"
            controls
            loop
            :class="{
              'real-image': selectedPair === index && isSelectedReal(first),
              'fake-image': selectedPair === index && !isSelectedReal(first)
            }"
            @touchstart="selectImage(first, index)"
            @click="
              (e) => {
                e.preventDefault()
                selectImage(first, index)
              }
            "
          />
          <p
            class="caption font-weight-medium font-size-body"
            :class="{ 'caption-visible': imageSelected }"
          >
            {{ first.caption }}
          </p>
        </div>

        <div v-if="isImage(second)" class="image">
          <img
            :src="second?.url"
            class="rounded-s"
            :class="{
              'real-image': selectedPair === index && isSelectedReal(second),
              'fake-image': selectedPair === index && !isSelectedReal(second)
            }"
            @click="selectImage(second, index)"
          />
          <p
            class="caption font-weight-medium font-size-body"
            :class="{ 'caption-visible': imageSelected }"
          >
            {{ second.caption }}
          </p>
        </div>
        <div v-else class="image">
          <video
            :src="second?.url"
            class="rounded-s"
            controls
            loop
            :class="{
              'real-image': selectedPair === index && isSelectedReal(second),
              'fake-image': selectedPair === index && !isSelectedReal(second)
            }"
            @touchstart="selectImage(first, index)"
            @click="
              (e) => {
                e.preventDefault()
                selectImage(first, index)
              }
            "
          />
          <p
            class="caption font-weight-medium text-body"
            :class="{ 'caption-visible': imageSelected }"
          >
            {{ second.caption }}
          </p>
        </div>
      </div>
    </div>
    <FButton
      v-if="currentIndex !== shuffledPairs.length - 1"
      @click="nextPair"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      label="next"
    />
    <FButton
      v-else
      @click="restart"
      on-dark
      :disabled="!currentPairExists || !imageSelected"
      label="restart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { FButton } from 'fari-component-library'

type Content = { url: string; caption: string }

const { real, fake } = storeToRefs(useGameStore())
const shuffledPairs = ref<{ first: Content; second: Content }[]>([])
const selectedPair = ref<number | null>(null)
const currentIndex = ref(0)
const realImageCounter = ref(0)
const imageSelected = ref(false)

function restart() {
  window.location.reload()
}

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
    // Handle end of game scenario
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

.caption {
  opacity: 0;

  transition: all 0.2s ease-in;
}
.caption-visible {
  opacity: 1;
}
</style>
