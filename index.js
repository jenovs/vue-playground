import Vue from 'vue';

const fetchUrl = '//api.jsonbin.io/b/5b6c71952b23fb1f2b722b4c';

// eslint-disable-next-line
new Vue({
  el: '#app',

  data: {
    answer: null,
    answerColor: 'black',
    random: '',
    userPick: '',
    words: {},
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
});
