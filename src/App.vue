<template>
  <div class="wrapper">
    <div class="status">Words left: {{ wordsLeft }} | Correct: {{ correct }} | Incorrect: {{ incorrect }}</div>
    <div 
      :style="{color: answerColor}" 
      class="word">
      {{ answer ? random : randomWord }}&nbsp;{{ notes }}</div>
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
      correct: 0,
      incorrect: 0,
      random: '',
      userPick: '',
      words: {},
      notShown: [],
    };
  },

  computed: {
    randomWord() {
      return this.random.split(' ')[1];
    },

    notes() {
      const { notes } = this.random && this.words[this.random];

      return notes ? `(${notes})` : '';
    },

    current(foo) {
      return this.words[this.random];
  },

    wordsLeft() {
      return this.notShown.length;
    },
  },

  mounted() {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(json => {
        this.words = json;
        this.notShown = Object.keys(json);
        this.setRandomWord();
      });
  },

  methods: {
    setRandomWord() {
      const words = Object.keys(this.words);
      let newRandom;

      if (!this.notShown.length) {
        return;
      }

      do {
        newRandom = words[Math.floor(Math.random() * words.length)];
      } while (this.random === newRandom || !this.notShown.includes(newRandom));

      this.random = newRandom;
      this.notShown.splice(this.notShown.indexOf(newRandom), 1);
    },

    checkAnswer(article) {
      this.answerColor = 'red';
      this.userPick = article;

      const isCorrectAnswer = this.random.split(' ')[0] === article;

      if (isCorrectAnswer) {
        this.answerColor = 'green';
        this.correct++;
      } else {
        this.incorrect++;
      }

      this.answer = this.words[this.random];
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
