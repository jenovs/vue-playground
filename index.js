fetch('./words.json')
  .then(res => res.json())
  .then(json => (vm.words = json));

const vm = new Vue({
  el: '#app',

  data: {
    answer: null,
    answerColor: 'black',
    random: 'voetbal',
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

  methods: {
    setRandomWord: function() {
      const words = Object.keys(this.words);
      let newRandom;

      do {
        newRandom = words[Math.floor(Math.random() * words.length)];
      } while (this.random === newRandom);

      this.random = newRandom;
    },

    checkAnswer: function(article) {
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

    next: function() {
      this.answerColor = 'black';
      this.answer = null;
      this.userPick = '';
      this.setRandomWord();
    },
  },
});
