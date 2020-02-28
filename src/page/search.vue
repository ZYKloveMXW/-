<template>
  <div>
    <h1>{{this.$store.state.msg}}</h1>
    <button @click="send">发送</button>
  </div>
</template>

<script>
export default {
  methods: {
    send() {
      this.$store.dispatch('sendMsg')
    }
  }
}
</script>

<style>

</style>