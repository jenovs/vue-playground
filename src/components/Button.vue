<template>
  <button 
    :class="['btn', {'btn-next': large}]"
    @click="handleClick"
  >{{ caption }}
  </button>
</template>

<script>
export default {
  props: {
    caption: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      if (this.large) {
        this.$emit('next');
      } else {
        this.$emit('handle-click', this.caption);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
