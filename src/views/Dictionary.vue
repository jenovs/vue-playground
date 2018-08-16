<template>
<div class="wrapper">
  <h2>Dictionary</h2>
  <form @submit.prevent="handleSubmit">
    <label for="term">
    <input type="text" id="term" v-model="term" placeholder="Input search term..." autofocus>
    </label>
    <button type="submit">Search</button>
  </form>
    <h3 class="title">Dutch 🇳🇱:</h3>
    <div v-html="scrapedNl"></div>
    <h3 class="title">Translation 🇬🇧:</h3>
    <div v-html="scrapedTr"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    scrapedNl: '',
    scrapedTr: '',
    term: '',
  }),

  methods: {
    handleSubmit() {
      this.scrapeNl(this.term);
      this.scrapeEn(this.term);

      this.scrapedNl = '<div>Searching...</div>';
      this.scrapedTr = '<div>Searching...</div>';
    },
    handleSuccess() {
      this.term = '';
    },
    scrapeNl(term: string) {
      fetch(`${process.env.VUE_APP_SCRAPER}/nl/${term}`)
        .then(res => res.text())
        .then(text => {
          this.scrapedNl = text;
          this.handleSuccess();
        });
    },
    scrapeEn(term: string) {
      fetch(`${process.env.VUE_APP_SCRAPER}/en/${term}`)
        .then(res => res.text())
        .then(text => {
          this.scrapedTr = text;
          this.handleSuccess();
        });
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('./freedictionary-results-v2.css');

button {
  background-color: transparent;
  border: 1px solid #999;
  border-radius: 2px;
  padding: 6px 20px;
}

form {
  align-items: center;
  display: flex;
  justify-content: center;
  margin: auto;
  max-width: 768px;
  width: 100%;
}

input {
  font-size: 1.3rem;
  margin-right: 1rem;
  padding: 5px;
}

.wrapper {
  flex: 1;
  padding: 1rem;
}
</style>
