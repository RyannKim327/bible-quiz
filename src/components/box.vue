<script setup lang="ts">
	const props = defineProps({
		text: String,
		click: Function
	})
</script>

<template>
  <span
    class="
      flex items-center justify-center
      aspect-square
      rounded-lg
      border-2 border-slate-400
      bg-white
      text-2xl font-bold uppercase
      cursor-pointer select-none
      transition-colors
      hover:bg-slate-100
      active:bg-slate-200
    "
  >
    {{ props.text }}
  </span>
</template>
