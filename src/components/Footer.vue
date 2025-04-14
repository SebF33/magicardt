<!-- Footer.vue -->
<template>
  <footer class="footer z-10 shadow-[0_-10px_15px_-5px_rgba(0,0,0,0.4)]">
    <div class="footer-content">
      <p>
        <a
          href="https://magic.wizards.com"
          class="font-black"
          target="_blank"
          rel="noopener noreferrer"
          title="Voir MTG"
        >
          &copy; Magic: The Gathering</a
        >
        /
        <a
          href="https://scryfall.com"
          class="font-black"
          target="_blank"
          rel="noopener noreferrer"
          title="Voir Scryfall"
        >
          &copy; Scryfall</a
        ><br />
        Magic: The Gathering est une marque déposée de Wizards of the Coast<br />
        Données fournies par
        <a
          href="https://scryfall.com/docs/api"
          class="font-black"
          target="_blank"
          rel="noopener noreferrer"
          title="Voir API Scryfall"
        >
          Scryfall</a
        >
      </p>
      <a
        class="github-link"
        href="https://github.com/SebF33"
        target="_blank"
        rel="noopener noreferrer"
        title="Voir mon GitHub"
      >
        <svg
          class="github-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <!-- Chemin SVG pour l'icône GitHub -->
          <path
            d="M12 0C5.371 0 0 5.371 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.01-1.04-.015-2.04C5.357 20.092 4.636 17.7 4.636 17.7c-.546-1.39-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.083 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.304 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.123-.303-.536-1.522.117-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.139 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.654.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.48 5.92.43.371.814 1.102.814 2.222 0 1.606-.015 2.896-.015 3.293 0 .32.218.694.824.576C20.565 21.8 24 17.303 24 12c0-6.629-5.371-12-12-12z"
          />
        </svg>
      </a>
    </div>
  </footer>
</template>



<script>
export default {
  name: "Footer",
};
</script>



<style scoped>
.footer {
  width: 100%;
  max-height: 120px;
  background: var(--secondary-color);
  color: var(--light-color);
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.github-link {
  color: var(--light-color);
  transition: transform 0.4s ease;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
}

.github-icon {
  width: 24px;
  height: 24px;
  fill: var(--light-color);
}
</style>
