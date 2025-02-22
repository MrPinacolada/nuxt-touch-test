<template>
  <div class="page-container">
    <div class="card-stack">
      <!-- Следующие карточки на фоне -->
      <div
        v-for="(card, index) in cards.slice(1)"
        :key="card.title"
        class="card-back"
        :style="{
          transform: `scale(${0.9 - index * 0.05}) translateY(${index * 10}px)`,
        }"
      ></div>

      <!-- Основная активная карточка -->
      <transition name="fade" @after-leave="removeCard">
        <div
          v-if="activeCard && !isRemoving"
          class="swipe-card"
          ref="card"
          :style="{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            // backgroundColor: cardColor,
          }"
          @touchstart="startDrag"
          @touchmove="drag"
          @touchend="endDrag"
          v-touch:swipe.left="() => swipeCard('left')"
          v-touch:swipe.right="() => swipeCard('right')"
          v-touch:swipe.up="() => swipeCard('up')"
          v-touch:swipe.down="() => swipeCard('down')"
        >
          <div class="card-content">
            <h3>{{ activeCard.title }}</h3>
            <p>{{ activeCard.description }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const card = ref<HTMLElement | null>(null);
const startPos = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });
const rotation = ref(0);
const isDragging = ref(false);
const isRemoving = ref(false);

const cards = ref([
  { title: "Карточка 1", description: "Описание 1" },
  { title: "Карточка 2", description: "Описание 2" },
  { title: "Карточка 3", description: "Описание 3" },
]);

const activeCard = computed(() => cards.value[0]);

const startDrag = (event: TouchEvent) => {
  isDragging.value = true;
  const touch = event.touches[0];
  startPos.value = {
    x: touch.clientX - position.value.x,
    y: touch.clientY - position.value.y,
  };
};

const drag = (event: TouchEvent) => {
  if (!isDragging.value) return;
  const touch = event.touches[0];
  position.value = {
    x: touch.clientX - startPos.value.x,
    y: touch.clientY - startPos.value.y,
  };

  // Вычисляем угол наклона
  rotation.value = position.value.x * 0.05;

  // Вычисление цвета в зависимости от положения карточки
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Для горизонтальной оси: чем дальше от центра, тем более насыщенный цвет
  const normalizedX = Math.min(Math.max(position.value.x / (screenWidth / 2), -1), 1);  // от -1 до 1
  const normalizedY = Math.min(Math.max(position.value.y / (screenHeight / 2), -1), 1);  // от -1 до 1

  // Рассчитываем цвет на основе позиции карточки (можно использовать любой цвет)
  const red = Math.floor(255 * (normalizedX > 0 ? normalizedX : 0));  // Красный цвет зависит от положения по X
  const green = Math.floor(255 * (normalizedX < 0 ? -normalizedX : 0));  // Зеленый цвет зависит от положения по X
  const blue = Math.floor(255 * (Math.abs(normalizedY)));  // Синий цвет зависит от положения по Y

  // Формируем цвет в формате rgb
  const cardColor = `rgb(${red}, ${green}, ${blue})`;

  // Применяем цвет и трансформацию
  const cardElement = card.value;
  if (cardElement) {
    cardElement.style.backgroundColor = cardColor;
  }
};


const endDrag = () => {
  isDragging.value = false;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const distX = Math.abs(position.value.x);
  const distY = Math.abs(position.value.y);

  let direction: "left" | "right" | "up" | "down" = "right";

  if (distX < screenWidth * 0.2 && distY < screenHeight * 0.2) {
    resetCard();
  } else {
    if (distX > distY) {
      direction = position.value.x > 0 ? "right" : "left";
    } else {
      direction = position.value.y > 0 ? "down" : "up";
    }

    animateCardOut(direction);
  }
};

const resetCard = () => {
  position.value = { x: 0, y: 0 };
  rotation.value = 0;
};

const animateCardOut = (direction: "left" | "right" | "up" | "down" = "right") => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const swipeDistance = Math.max(screenWidth, screenHeight) * 0.3;
  isRemoving.value = true;

  let swipeX = 0;
  let swipeY = 0;
  let rotationValue = 0;

  switch (direction) {
    case "left":
      swipeX = -swipeDistance;
      rotationValue = -30;
      break;
    case "right":
      swipeX = swipeDistance;
      rotationValue = 30;
      break;
    case "up":
      swipeY = -swipeDistance;
      break;
    case "down":
      swipeY = swipeDistance;
      break;
  }

  position.value = { x: swipeX, y: swipeY };
  rotation.value = rotationValue;

  const cardElement = card.value;
  if (cardElement) {
    cardElement.style.setProperty('--swipe-x', `${swipeX}px`);
    cardElement.style.setProperty('--swipe-y', `${swipeY}px`);
  }

  setTimeout(() => {
    isRemoving.value = false;
  }, 300);
};


const removeCard = () => {
  cards.value.shift();
  resetCard();
  cards.value.push({
    title: `Новая карточка ${cards.value.length + 1}`,
    description: "Описание новой карточки",
  });

};

const swipeCard = (direction: "left" | "right" | "up" | "down") => {
  animateCardOut(direction);
};
</script>
<style>
html,
body {
  overscroll-behavior: none;
  touch-action: none;
  overflow: hidden;
  height: 100%;
}
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f4f4f9;
  font-family: Arial, sans-serif;
}

.card-stack {
  position: relative;
  width: 300px;
  height: 400px;
}

.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ddd;
  border-radius: 10px;
}

.swipe-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease-out, opacity 0.3s ease-out;
}

.card-content {
  text-align: center;
}

.fade-enter-active {
  animation: fadeIn 0.5s ease-out;
}
.fade-leave-active {
  animation: fadeOut 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(var(--swipe-x, 0)) translateY(var(--swipe-y, 0)); 
  }
}

</style>
