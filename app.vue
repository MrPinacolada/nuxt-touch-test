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
      <transition name="fade" @after-leave="removeCard">
        <div
          v-if="activeCard && !isRemoving"
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
            <h3>{{ activeCard.title }}</h3>
            <p>{{ activeCard.description }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";

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
  rotation.value = position.value.x * 0.05;
};

const endDrag = () => {
  isDragging.value = false;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const distX = Math.abs(position.value.x);
  const distY = Math.abs(position.value.y);

  if (distX < screenWidth * 0.2 && distY < screenHeight * 0.2) {
    resetCard();
  } else {
    animateCardOut();
  }
};

const resetCard = () => {
  position.value = { x: 0, y: 0 };
  rotation.value = 0;
};

const animateCardOut = (
  direction: "left" | "right" | "up" | "down" = "right"
) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const swipeDistance = Math.max(screenWidth, screenHeight) * 1.2; // Улетает за экран

  isRemoving.value = true;

  // Направления для анимации
  switch (direction) {
    case "left":
      position.value = { x: -swipeDistance, y: 0 }; // Улетает влево
      rotation.value = -30;
      break;
    case "right":
      position.value = { x: swipeDistance, y: 0 }; // Улетает вправо
      rotation.value = 30;
      break;
    case "up":
      position.value = { x: 0, y: -swipeDistance }; // Улетает вверх
      rotation.value = 0;
      break;
    case "down":
      position.value = { x: 0, y: swipeDistance }; // Улетает вниз
      rotation.value = 0;
      break;
  }

  // Карточка пропадает через 300 мс (время анимации)
  setTimeout(() => {
    isRemoving.value = false;
  }, 300);
};

const removeCard = () => {
  cards.value.shift(); // Удаляем старую карточку
  resetCard();

  // Добавляем новую карточку перед жестами
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
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.card-content {
  text-align: center;
}

.fade-enter-active {
  animation: fadeIn 0.3s ease-out;
}
.fade-leave-active {
  animation: fadeOut 0.3s ease-out;
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
    transform: translate(100vw, 0); /* Двигаем в сторону */
  }
}
</style>
