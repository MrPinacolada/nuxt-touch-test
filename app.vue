<template>
  <div class="page-container">
    <h1>Перетаскивай карточку</h1>

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
      <div
        class="swipe-card"
        ref="card"
        :style="{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          backgroundColor: cardColor,
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
          <h3>{{ cards[0].title }}</h3>
          <p>{{ cards[0].description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const card = ref<HTMLElement | null>(null);
const startPos = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });
const rotation = ref(0);
const isDragging = ref(false);

const cards = ref([
  { title: "Карточка 1", description: "Описание 1" },
  { title: "Карточка 2", description: "Описание 2" },
  { title: "Карточка 3", description: "Описание 3" },
]);

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
  rotation.value = position.value.x * 0.05;
  updateCardColor();
};

const endDrag = () => {
  isDragging.value = false;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const distX = Math.abs(position.value.x);
  const distY = Math.abs(position.value.y);

  if (distX < screenWidth * 0.1 && distY < screenHeight * 0.1) {
    resetCard();
  } else {
    animateCardOut();
  }
};

const resetCard = () => {
  position.value = { x: 0, y: 0 };
  rotation.value = 0;
  updateCardColor();
};

const animateCardOut = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const threshold = 100;

  let newX = position.value.x;
  let newY = position.value.y;

  if (position.value.x > screenWidth / 2 - threshold) newX = screenWidth;
  if (position.value.x < -screenWidth / 2 + threshold) newX = -screenWidth;
  if (position.value.y > screenHeight / 2 - threshold) newY = screenHeight;
  if (position.value.y < -screenHeight / 2 + threshold) newY = -screenHeight;

  position.value = { x: newX, y: newY };
  rotation.value = newX > 0 ? 30 : -30;

  setTimeout(() => {
    removeCard();
  }, 300);
};

const removeCard = () => {
  cards.value.push(cards.value.shift()!);
  resetCard();
};

const updateCardColor = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const xRatio = Math.abs(position.value.x) / (screenWidth / 2);
  const yRatio = Math.abs(position.value.y) / (screenHeight / 2);

  let red = Math.min(255, Math.floor(255 * xRatio));
  let blue = Math.min(255, Math.floor(255 * yRatio));

  cardColor.value = `rgb(${red}, ${255 - red}, ${blue})`;
};

const cardColor = ref("rgb(52, 152, 219)");

// Функция обработки свайпа
const swipeCard = (direction: "left" | "right" | "up" | "down") => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const swipeDistance = 300; // Насколько далеко улетает карточка

  switch (direction) {
    case "left":
      position.value = { x: -swipeDistance, y: 0 };
      rotation.value = -30;
      break;
    case "right":
      position.value = { x: swipeDistance, y: 0 };
      rotation.value = 30;
      break;
    case "up":
      position.value = { x: 0, y: -swipeDistance };
      rotation.value = 0;
      break;
    case "down":
      position.value = { x: 0, y: swipeDistance };
      rotation.value = 0;
      break;
  }

  setTimeout(() => {
    removeCard();
  }, 300);
};
</script>

<style>
html,
body {
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
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
  transition: transform 0.3s ease-out;
}

.card-content {
  text-align: center;
}
</style>
