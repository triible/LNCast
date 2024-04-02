<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/history">History</RouterLink>
      </nav>
    </div>
    <h1>LN⚡Cast</h1>

  </header>

  <RouterView />

  <footer>
    Made in ❤️ by <a href="https://github.com/eeguney">@eeguney</a> from <a href="https://alpha.triible.com">Triible</a>
    for <strong>Lightning Network Community</strong>
  </footer>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

nav a.router-link-exact-active {
  color: var(--green);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: var(--color-text);
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

footer {
  text-align: center;
  margin: 1.5rem 0;
}
</style>
