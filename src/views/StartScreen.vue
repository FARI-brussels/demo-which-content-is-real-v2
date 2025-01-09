<template>
  <div class="start-screen">
    <FLanguageSelector @update:locale="setLocale" class="locale-item" />
    <video autoplay muted loop class="background-video">
      <source src="../assets/OXOplayer.mp4" type="video/mp4" />
    </video>
    <div class="heading">
      <div class="title">
        <FTitle v-if="data?.title" class="title"> {{ data.title[locale] }}</FTitle>
        <FButtonIcon name="tooltip" color="blue-light" class="tooltip" @click="toggleCard" />
      </div>
      <FSubTitle v-if="data?.topic" class="subtitle"> {{ data.topic[locale] }} </FSubTitle>
    </div>

    <FButton label="start" type="primary" class="start-button" on-dark @click="startGame" />

    <FSlideTransition :show="showCard">
      <FCard
        v-if="showCard && data?.description"
        @close="toggleCard"
        @update:locale="setLocale"
        class="card"
      >
        {{ data.description[locale] }}

        <div class="researchers-container">
          <span class="researchers">
            research lead:
            <span class="research-lead color-black"> {{ data?.research_lead }} </span>
          </span>
          <img v-for="sdg in data.sdg_images" :src="sdg" class="sdg" />
        </div>
        <template #footer>
          <div v-if="data?.logos">
            <img v-for="logo in data.logos" :src="logo" class="card-logo" />
          </div>
        </template>
      </FCard>
    </FSlideTransition>
    <div class="backdrop" :class="{ 'backdrop-active': showCard }"></div>
    <FFooter />
  </div>
</template>

<script setup lang="ts">
import {
  FButton,
  FTitle,
  FSubTitle,
  FButtonIcon,
  FFooter,
  FSlideTransition,
  FCard,
  FLanguageSelector
} from 'fari-component-library'
import { useCMSstore } from '@/stores/cms'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const emit = defineEmits(['start-game'])

const { data, locale } = storeToRefs(useCMSstore())
const { getData, setLocale } = useCMSstore()

const showCard = ref(false)

const startGame = async () => emit('start-game')

onMounted(getData)

const toggleCard = () => (showCard.value = !showCard.value)
</script>

<style scoped lang="scss">
.locale-item {
  position: absolute;
  top: 2rem;
  right: 2rem;

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
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
.start-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-image: url('../assets/robot-bg.png'),
    radial-gradient(circle, rgba(75, 118, 212, 0.6) 0%, rgba(24, 62, 145, 1) 70%);
  background-size: 110%;
  justify-content: space-around;
  align-items: center;
  flex: 0 0 auto;
  position: relative;
  z-index: 0;
}

.heading {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
  margin-bottom: auto;

  .title {
    gap: 1rem;
    display: flex;
  }
}

.start-button {
  margin-bottom: auto;
  width: fit-content;
}
.card {
  position: absolute;
  top: 25%;
  left: 20%;
  z-index: 2;
}

.backdrop {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(24, 62, 145, 0.4);
  backdrop-filter: blur(0);
  z-index: 1;
  transition: all 100ms;

  &-active {
    visibility: visible;
    opacity: 1;
    backdrop-filter: blur(2px);
    transition: all 300ms;
  }
}

.researchers-container {
  margin-top: auto;
  display: flex;
  flex-direction: column;
}

.card-logo {
  height: 3.5rem;
  margin-right: 2rem;
}
.sdg {
  height: 3.5rem;
  width: 3.5rem;
}
</style>
