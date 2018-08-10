<template>
  <div class="wrapper">
    <div 
      :style="{color: answerColor}" 
      class="word">
    <span class="article">{{ answer ? answer.article : '' }}</span>{{ randomWord }}</div>
    <div>
      <button 
        v-if="!answer" 
        class="btn" 
        @click="checkAnswer('het')">het</button>
      <button 
        v-if="!answer" 
        class="btn" 
        @click="checkAnswer('de')">de</button>
      <button 
        v-if="answer" 
        class="btn btn-next" 
        @click="next">next</button>
    </div>
    <div class="word">{{ answer ? answer.translation.en.join(', ') : '' }}</div>
  </div>
</template>

<script>
import Hello from './components/Hello.vue';

const fetchUrl = '//api.jsonbin.io/b/5b6c71952b23fb1f2b722b4c';

export default {
  components: { hello: Hello },
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

.btn {
  background-color: transparent;
  border: 2px solid #666;
  border-radius: 2px;
  font-size: 1.5rem;
  height: 50px;
  margin: 15px;
  width: 80px;
}

.btn:disabled {
  border-color: #999;
}

.btn-next {
  width: 194px;
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
