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
        caption="de"
        title="Shortcut: d or 1"
        @handle-click="checkAnswer" />
      <custom-button
        v-if="!answer" 
        caption="het"
        title="Shortcut: h or 2"
        @handle-click="checkAnswer" />
      <custom-button
        v-if="answer"
        title="Shortcut: Enter or Space"
        :large="true"
        :disabled="!notShown.length"
        caption="next"
        @next="next" />
    </div>
    <div class="word" v-if="answer">
    <div v-for="(tr, i) in answer.translation.en" :key="i">{{ i + 1 }}. {{ tr }}</div>
    </div>
  </div>
</template>

<script>
import Button from './components/Button.vue';

const fetchUrl = 'https://s3.amazonaws.com/vj-share/words.json';
// const fetchUrl = './words.json';

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

    current() {
      return this.words[this.random];
    },

    wordsLeft() {
      return this.notShown.length;
    },
  },

  created() {
    window.addEventListener('keydown', this.handleKeypress);
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
    handleKeypress(e) {
      const keyMapping = {
        1: 'de',
        2: 'het',
        d: 'de',
        h: 'het',
      };

      if (this.userPick) {
        if (e.key === 'Enter' || e.code === 'Space') {
          this.next();
        }
      } else {
        this.checkAnswer(keyMapping[e.key]);
      }
    },

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
      if (!article) {
        return;
      }

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

      if (!this.notShown.length) {
        this.reset();
      }

      this.setRandomWord();
    },

    reset() {
      this.notShown = Object.keys(this.words);
      this.correct = 0;
      this.incorrect = 0;
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
