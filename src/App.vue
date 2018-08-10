<template>
  <div class="wrapper">
    <div 
      :style="{color: answerColor}" 
      class="word">
    <span class="article">{{ answer ? answer.article : '' }}</span>{{ randomWord }}</div>
    <div>
      <custom-button 
        v-if="!answer" 
        caption="het" 
        @handle-click="checkAnswer">het</custom-button>
      <custom-button 
        v-if="!answer" 
        caption="de" 
        @handle-click="checkAnswer">de</custom-button>
      <custom-button 
        v-if="answer" 
        :large="true" 
        caption="next" 
        @next="next">next</custom-button>
    </div>
    <div class="word">{{ answer ? answer.translation.en.join(', ') : '' }}</div>
  </div>
</template>

<script>
import Button from './components/Button.vue';

const fetchUrl = '//api.jsonbin.io/b/5b6c71952b23fb1f2b722b4c';

export default {
  components: { 'custom-button': Button },
  data() {
    return {
      answer: null,
      answerColor: 'black',
      random: '',
      userPick: '',
      words: {},
    };
  },

  computed: {
    randomWord: function() {
      return this.random;
    },

    current: function(foo) {
      return this.words[this.randomWord];
    },
  },

  mounted() {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(json => {
        this.words = json;
        this.setRandomWord();
      });
  },

  methods: {
    setRandomWord() {
      const words = Object.keys(this.words);
      let newRandom;

      do {
        newRandom = words[Math.floor(Math.random() * words.length)];
      } while (this.random === newRandom);

      this.random = newRandom;
    },

    checkAnswer(article) {
      this.answerColor = 'red';
      this.userPick = article;

      const answer = this.current.find((word, i) => article === word.article);

      if (answer) {
        this.answerColor = 'green';
        this.answer = answer;
      } else {
        this.answer = this.current[0];
      }
    },

    next() {
      this.answerColor = 'black';
      this.answer = null;
      this.userPick = '';
      this.setRandomWord();
    },
  },
};
</script>


<style scoped>
.article {
  display: inline-block;
  margin-right: 1ch;
  text-align: right;
  width: 3ch;
}

.word {
  font-size: 2rem;
  padding: 2rem;
}

.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  max-width: 768px;
  padding-top: 2rem;
  width: 100%;
}
</style>
