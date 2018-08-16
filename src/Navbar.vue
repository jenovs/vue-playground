<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" exact>Home</router-link> |
      <router-link to="/settings">Settings</router-link> |
      <router-link to="/dict">Dictionary</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  color: #333;
  pointer-events: none;
  text-decoration: none;
}
</style>
