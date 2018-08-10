<template>
  <div class="full-width center-content"><hello name="Vue" /></div>
</template>

<script>
import Hello from './components/Hello.vue';
export default {
  components: { hello: Hello },
};
</script>


<style scoped>
.full-width {
  width: 100%;
}

.center-content {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
