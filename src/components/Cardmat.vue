<!-- Cardmat.vue -->
<template>
  <div class="cardmat-container mt-10">
    <div class="cardmat" ref="matRef" @dragover.prevent @drop="onDrop">
      <div
        v-for="card in items"
        :key="card.id"
        class="card-item"
        :style="cardStyle(card)"
        @mousedown="onMouseDown($event, card.id)"
        @dblclick="changeRotation(card.id)"
      >
        <img
          :src="card.card_image_hd || card.card_image"
          :alt="card.card_name"
          class="rounded-lg"
          loading="lazy"
          draggable="false"
        />
      </div>
    </div>
  </div>
</template>



<script>
import { computed, onMounted, reactive, ref } from "vue";
import { useMainStore } from "../utils/mainStore";

export default {
  name: "Cardmat",

  setup() {
    const store = useMainStore();

    // Accès aux données du store
    const items = computed(() => store.items);

    // Zone
    const matRef = ref(null);
    // Stocker la position (x,y), la rotation et le z-index de chaque carte (indexé par card.id)
    const positions = reactive({});
    // Dimensions de la zone
    const matWidth = ref(600);
    const matHeight = ref(400);
    // Dimensions de chaque carte
    const cardWidth = 180;
    const cardHeight = 252;
    // Compteur pour z-index des cartes déplacées
    const currentTopZ = ref(1);

    // Position et rotation aléatoires pour chaque carte
    onMounted(() => {
      if (matRef.value) {
        const rect = matRef.value.getBoundingClientRect();
        matWidth.value = rect.width;
        matHeight.value = rect.height;
      }
      items.value.forEach((card) => {
        if (!positions[card.id]) {
          positions[card.id] = {
            x: Math.random() * (matWidth.value - cardWidth),
            y: Math.random() * (matHeight.value - cardHeight),
            rotation: Math.random() * 30 - 15, // entre -15° et +15°
            z: currentTopZ.value,
          };
        }
      });
    });

    // Drag & drop
    const dragging = ref(null); // id de la carte en cours de déplacement
    const dragOffset = reactive({ x: 0, y: 0 });
    const borderThreshold = 20; // seuil (px) pour déceler un clic sur le bord

    const onMouseDown = (event, cardId) => {
      if (!matRef.value) return;
      const cardElem = event.currentTarget;
      const cardRect = cardElem.getBoundingClientRect();

      // clic sur les bords : on change uniquement la rotation
      if (
        event.offsetX < borderThreshold ||
        event.offsetX > cardRect.width - borderThreshold ||
        event.offsetY < borderThreshold ||
        event.offsetY > cardRect.height - borderThreshold
      ) {
        changeRotation(cardId);
        return;
      }

      // pour que la carte soit au-dessus
      positions[cardId].z = currentTopZ.value + 1;
      currentTopZ.value = positions[cardId].z;

      dragging.value = cardId;
      //const matRect = matRef.value.getBoundingClientRect();
      dragOffset.x = event.clientX - cardRect.left;
      dragOffset.y = event.clientY - cardRect.top;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (event) => {
      if (dragging.value !== null && matRef.value) {
        const matRect = matRef.value.getBoundingClientRect();
        let newX = event.clientX - matRect.left - dragOffset.x;
        let newY = event.clientY - matRect.top - dragOffset.y;
        // la carte reste dans le mat
        newX = Math.max(0, Math.min(newX, matWidth.value - cardWidth));
        newY = Math.max(0, Math.min(newY, matHeight.value - cardHeight));
        positions[dragging.value].x = newX;
        positions[dragging.value].y = newY;
      }
    };

    const onMouseUp = () => {
      dragging.value = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    const onDrop = (event) => {
      event.preventDefault();
    };

    // Changer la rotation d'une carte
    const changeRotation = (cardId) => {
      positions[cardId].rotation = Math.random() * 30 - 15;
    };

    // Calcul du style pour chaque carte (position, rotation et z-index)
    const cardStyle = (card) => {
      const pos = positions[card.id] || { x: 0, y: 0, rotation: 0, z: 1 };
      return {
        left: pos.x + "px",
        top: pos.y + "px",
        transform: `rotate(${pos.rotation}deg)`,
        zIndex: pos.z,
      };
    };

    return {
      items,
      positions,
      matRef,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onDrop,
      changeRotation,
      cardStyle,
    };
  },
};
</script>



<style scoped>
.cardmat-container {
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.cardmat {
  position: relative;
  width: 100%;
  height: 400px;
  border: 4px dashed var(--secondary-color);
  padding: 1rem;
  border-radius: 20px;
  background-color: var(--lighter-primary-color);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cdefs%3E%3Cpattern id='fabric' patternUnits='userSpaceOnUse' width='20' height='20'%3E%3Cpath d='M0 10h20 M10 0v20' stroke='rgba(255,255,255,0.3)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23fabric)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: auto;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8),
    0 -6px 12px rgba(0, 0, 0, 0.2), 6px 0 12px rgba(0, 0, 0, 0.2),
    -6px 0 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.cardmat::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url("../assets/complete-logo.png") no-repeat center;
  background-size: contain;
  width: clamp(200px, 80vw, 1100px);
  height: clamp(200px, 80vw, 1100px);
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

.card-item {
  position: absolute;
  width: 180px;
  height: 252px;
  cursor: move;
  user-select: none;
  transition: transform 0.2s;
  box-sizing: border-box;
}

.card-item img {
  width: 100%;
  display: block;
  pointer-events: none;
}
</style>
