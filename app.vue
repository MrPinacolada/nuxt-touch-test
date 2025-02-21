<template>
  <div class="page-container">
    <h1>Демонстрация свайпов</h1>

    <!-- Контейнер для свайпа блоков -->
    <div class="swipe-container">
      <div
        v-for="(block, index) in blocks"
        :key="index"
        class="swipe-block"
        :class="{ 'active': currentIndex === index }"
        v-touchstart="onTouchStart"
        v-touchmove="onTouchMove"
        v-touchend="onTouchEnd"
        v-touchcancel="onTouchCancel"
        v-swipeleft="onSwipeLeft"
        v-swiperight="onSwipeRight"
      >
        <p>{{ block }}</p>
      </div>
    </div>

    <!-- Сообщение о последнем жесте -->
    <div v-if="lastGesture" class="gesture-info">
      <p>Последний жест: {{ lastGesture }}</p>
    </div>

    <!-- Результат свайпа -->
    <div v-if="swipedDirection" class="swipe-result">
      <p>Ты свайпнул в: {{ swipedDirection }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const lastGesture = ref<string>(''); // Хранит последний жест
const swipedDirection = ref<string>(''); // Направление свайпа
const currentIndex = ref<number>(0); // Индекс текущего блока
const blocks = ref<string[]>([
  'Блок 1: Пример контента 1',
  'Блок 2: Пример контента 2',
  'Блок 3: Пример контента 3',
  'Блок 4: Пример контента 4',
]);

// Обработчики жестов
const onTouchStart = () => {
  lastGesture.value = 'Touch start';
};

const onTouchMove = () => {
  lastGesture.value = 'Touch move';
};

const onTouchEnd = () => {
  lastGesture.value = 'Touch end';
};

const onTouchCancel = () => {
  lastGesture.value = 'Touch cancel';
};

const onSwipeLeft = () => {
  swipedDirection.value = 'left';
  if (currentIndex.value < blocks.value.length - 1) {
    currentIndex.value++;
  }
  lastGesture.value = 'Swipe left';
};

const onSwipeRight = () => {
  swipedDirection.value = 'right';
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
  lastGesture.value = 'Swipe right';
};

</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f9;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.swipe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
  overflow: hidden;
  position: relative;
}

.swipe-block {
  width: 100%;
  max-width: 400px;
  height: 200px;
  margin: 10px 0;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.5;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.swipe-block.active {
  opacity: 1;
  transform: scale(1.05);
}

.gesture-info {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}

.swipe-result {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
}

@media (max-width: 600px) {
  .swipe-container {
    height: 70%;
  }
  .swipe-block {
    max-width: 90%;
    height: 180px;
  }
}
</style>
