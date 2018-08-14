<template>
<div class="wrapper">
  <a :href="downloadLink" download="words.json">Download words.json</a><span>&nbsp;(total words: {{ Object.keys(words).length }})</span>
  <div class="danger">
    <label><input type="checkbox" @change="isDangerZoneEnabled = !isDangerZoneEnabled" :checked="isDangerZoneEnabled"> Enable danger zone</label>
    <br>
    <br>
    <fieldset :disabled="!isDangerZoneEnabled">
      <legend>Danger zone</legend>
      <button @click="getRemoteData" :disabled="!isDangerZoneEnabled">Fetch data from server</button><p>(will overwrite local copy)</p>
    </fieldset>
  </div>
  <div class="checker">
    <label>Check a word in dictionary: <input type="text" v-model="checkWord"></label>
    <p v-if="checkWord.length">{{ checkResult }}</p>
  </div>
  <div class="form-wrapper">
    <form @submit="handleSubmit">
      <select name="article" id="article" @change="handleSelect" autofocus ref="article">
        <option value="" :selected="article === ''">select article</option>
        <option value="de" :selected="article === 'de'">de</option>
        <option value="het" :selected="article === 'het'">het</option>
      </select>
      <input type="text" placeholder="noun" v-model="noun" @blur="scrape">
      <input type="text" placeholder="plural" v-model="plural">
      <textarea type="text" placeholder="translations" v-model="translation"/>
      <input type="text" placeholder="notes" v-model="notes">
      <button type="submit" :disabled="!article || !noun">Save</button>
      <p style="color: red" v-if="isDuplicate">Word already exists</p>
    </form>
    <div style="margin-top: 1rem;">
      <button @click="clear" :disabled="!scrapedNl && !scrapedTr">Clear </button>
    </div>
    <p class="title">Dutch 🇳🇱:</p>
    <div v-html="scrapedNl" class="scrape"></div>
    <p class="title">Translation 🇬🇧:</p>
    <div v-html="scrapedTr" class="scrape"></div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
// tslint:disable-next-line
const words = require('../../words.json');

const fetchUrl = 'https://s3.amazonaws.com/vj-share/words.json';

export default Vue.extend({
  data: () => ({
    article: '',
    checkWord: '',
    fetchUrl,
    isDangerZoneEnabled: false,
    notes: '',
    noun: '',
    plural: '',
    scrapedNl: '',
    scrapedTr: '',
    translation: '',
    words: {},
  }),

  computed: {
    downloadLink(): string {
      return (
        `data:text/plain;charset=utf-8,` +
        encodeURIComponent(JSON.stringify(this.words))
      );
    },
    isDuplicate(): boolean {
      return Object.keys(this.words).includes(`${this.article} ${this.noun}`);
    },
    checkResult(): string {
      const keys = Object.keys(this.words);
      if (keys.includes(`de ${this.checkWord}`)) {
        return `"de ${this.checkWord}" exists`;
      } else if (keys.includes(`het ${this.checkWord}`)) {
        return `"het ${this.checkWord}" exists`;
      }
      return 'Word not found';
    },
  },

  mounted() {
    this.getData();
    if (!Object.keys(this.words).length) {
      this.words = words;
    }
  },

  methods: {
    scrape() {
      this.scrapedNl = '';
      this.scrapedTr = '';

      if (!this.noun) {
        return;
      }

      this.scrapeNl();
      this.scrapeEn();
    },
    scrapeNl() {
      fetch(`${process.env.VUE_APP_SCRAPER}/nl/${this.noun}`)
        .then(res => res.text())
        .then(text => (this.scrapedNl = text));
    },
    scrapeEn() {
      fetch(`${process.env.VUE_APP_SCRAPER}/en/${this.noun}`)
        .then(res => res.text())
        .then(text => (this.scrapedTr = text));
    },
    clear() {
      this.scrapedNl = '';
      this.scrapedTr = '';
      this.article = '';
      this.notes = '';
      this.noun = '';
      this.plural = '';
      this.translation = '';
    },

    getData() {
      const wordsString = localStorage.getItem('words');

      this.words = wordsString ? JSON.parse(wordsString) : {};
    },

    getRemoteData() {
      fetch(fetchUrl)
        .then(res => res.json())
        .then(json => {
          this.words = json;
          this.saveData();
          this.disableDangerZone();
        });
    },

    handleSelect(e: any) {
      this.article = e.target.value;
    },

    handleSubmit(e: any) {
      e.preventDefault();

      this.noun = this.noun.trim();

      if (this.isDuplicate) {
        return;
      }

      const notes: any = {};

      if (this.notes) {
        notes.notes = this.notes;
      }

      this.words = {
        ...this.words,
        [`${this.article} ${this.noun}`]: {
          plural: this.plural,
          translation: {
            en: this.translation.split('\n'),
          },
          ...notes,
        },
      };

      this.saveData();
      this.clear();

      (this.$refs.article as HTMLSelectElement).focus();
    },

    saveData() {
      localStorage.setItem('words', JSON.stringify(this.words));
    },

    disableDangerZone() {
      this.isDangerZoneEnabled = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('./freedictionary-results-v2.css');

fieldset {
  display: flex;
  flex-direction: column;
  max-width: 300px;

  &:disabled > p {
    color: #999;
  }
}
textarea {
  height: 3rem;
  resize: none;
  white-space: pre-line;
}
.checker {
  height: 40px;
  margin: 2rem;
}
.danger {
  background-color: #f2f2f2;
  margin-top: 2rem;
  padding: 1rem;
}
.form-wrapper {
  margin: 2rem;

  & > form {
    box-shadow: 0 0 1px #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    max-width: 300px;
    padding: 1rem;
    width: 100%;

    & > select {
      max-width: 100px;
    }
  }
}
.title {
  font-weight: bold;
  font-size: 1.2rem;
}
.wrapper {
  padding: 1rem 2rem;
}
</style>
