<template>
  <div class="page-container">
    <h1>Свайпни карточки</h1>

    <!-- Контейнер для свайпа блоков -->
    <div class="swipe-container">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="swipe-card"
        :class="{ active: currentIndex === index }"
        v-touch:swipe.left="swipeLeftHandler(index)"
        v-touch:swipe.right="swipeRightHandler(index)"
        v-touch:press="pressHandler"
        v-touch:longtap="longTapHandler"
      >
        <div class="card-content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <!-- Сообщение о последнем жесте -->
    <div v-if="lastGesture" class="gesture-info">
      <p>Последний жест: {{ lastGesture }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const lastGesture = ref<string>(''); // Хранит последний жест
const currentIndex = ref<number>(0); // Индекс текущей карточки
const cards = ref<{ title: string, description: string }[]>([
  { title: 'Карточка 1', description: 'Описание карточки 1' },
  { title: 'Карточка 2', description: 'Описание карточки 2' },
  { title: 'Карточка 3', description: 'Описание карточки 3' },
]);

// Обработчики жестов
const swipeLeftHandler = (index: number) => {
  if (index < cards.value.length - 1) {
    currentIndex.value++;
    lastGesture.value = 'Свайп влево';
  }
};

const swipeRightHandler = (index: number) => {
  if (index > 0) {
    currentIndex.value--;
    lastGesture.value = 'Свайп вправо';
  }
};

const pressHandler = () => {
  lastGesture.value = 'Нажатие';
};

const longTapHandler = () => {
  lastGesture.value = 'Долгое нажатие';
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

.swipe-card {
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
  transform: translateX(0); /* По умолчанию карточки не двигаются */
}

.swipe-card.active {
  opacity: 1;
  transform: scale(1.05);
}

.gesture-info {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}

.card-content {
  text-align: center;
}

@media (max-width: 600px) {
  .swipe-container {
    height: 70%;
  }
  .swipe-card {
    max-width: 90%;
    height: 180px;
  }
}
</style>
