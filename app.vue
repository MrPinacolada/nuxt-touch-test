<template>
  <div class="page-container">
    <h1>Свайпни или тапни карточку</h1>

    <!-- Контейнер для свайпабельных карточек с анимацией -->
    <div class="swipe-container">
      <transition
        name="card-swipe"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <!-- Показываем только текущую карточку -->
        <div
          class="swipe-card"
          :key="currentIndex"
          v-touch:swipe.left="swipeLeftHandler"
          v-touch:swipe.right="swipeRightHandler"
          v-touch:tap="tapHandler"
          v-touch:longtap="longTapHandler"
          v-touch:press="pressHandler"
          v-touch:release="releaseHandler"
          v-touch:drag="dragHandler"
        >
          <div class="card-content">
            <h3>{{ cards[currentIndex].title }}</h3>
            <p>{{ cards[currentIndex].description }}</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Сообщение о последнем действии -->
    <div v-if="lastGesture" class="gesture-info">
      <p>Последний жест: {{ lastGesture }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Хранение информации о последнем действии и текущем индексе карточки
const lastGesture = ref<string>('');
const currentIndex = ref<number>(0);
const cards = ref<{ title: string; description: string }[]>([
  { title: 'Карточка 1', description: 'Описание карточки 1' },
  { title: 'Карточка 2', description: 'Описание карточки 2' },
  { title: 'Карточка 3', description: 'Описание карточки 3' },
]);

// Обработчик свайпа влево
const swipeLeftHandler = () => {
  lastGesture.value = 'Свайп влево';
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++;
  }
};

// Обработчик свайпа вправо
const swipeRightHandler = () => {
  lastGesture.value = 'Свайп вправо';
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// Обработчик тапов
const tapHandler = () => {
  lastGesture.value = 'Тап';
};

// Обработчик долгого тапа
const longTapHandler = () => {
  lastGesture.value = 'Долгий тап';
};

// Обработчик начала нажатия (press)
const pressHandler = () => {
  lastGesture.value = 'Нажатие';
};

// Обработчик отпускания (release)
const releaseHandler = () => {
  lastGesture.value = 'Отпускание';
};

// Обработчик перетаскивания (drag)
const dragHandler = () => {
  lastGesture.value = 'Перетаскивание';
};

// Анимация появления
const beforeEnter = (el: HTMLElement) => {
  el.style.transform = 'translateX(100%)'; // Изначальное положение за пределами экрана
  el.style.transition = 'none'; // Без анимации перед анимацией входа
};

// Анимация перемещения
const enter = (el: HTMLElement, done: () => void) => {
  el.offsetHeight; // Принудительное перерисовывание
  el.style.transition = 'transform 0.5s ease-out'; // Плавное движение
  el.style.transform = 'translateX(0)';
  done();
};

// Анимация исчезновения
const leave = (el: HTMLElement, done: () => void) => {
  el.style.transition = 'transform 0.5s ease-in'; // Плавный исход
  el.style.transform = 'translateX(-100%)'; // Сдвигаем карточку за экран
  done();
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

.swipe-container {
  width: 100%;
  max-width: 400px;
  height: 300px;
  overflow: hidden;
  position: relative;
}

.swipe-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0.9;
}

.card-content {
  text-align: center;
}

.gesture-info {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
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

/* Плавные переходы для карт */
.card-swipe-enter-active,
.card-swipe-leave-active {
  transition: transform 0.5s ease-out;
}

.card-swipe-enter, .card-swipe-leave-to /* .card-swipe-leave-active in <2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}
</style>
