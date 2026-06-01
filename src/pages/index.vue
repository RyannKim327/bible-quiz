<script setup lang="ts">
	import { ref, onMounted } from "vue"
	import { github } from "@/lib/api.ts"
	import { quiz } from "@/lib/interfaces.ts"

	import Box from "@/components/box.vue"

	const lists = ref<quiz[]>([])

	const numbers = ref<number[]>([])
	const number = ref(0)
	const score = ref(0)
	const letters: String[] = Array.from("abcdefghijklmnopqrstuvwxyz0123456789:-".toUpperCase())
	const answer = ref<String[]>([])
	
	onMounted(async () => {
		const data = await github()
		lists.value = data
		if(data.length > 0){
			for(let i = 0; i < data.length; i++){
				const n = Math.floor(Math.random() * data.length)
				if(numbers.value.includes(n)){
					i--
				}else{
					numbers.value.push(n)
				}
			}
			console.log(numbers)
		}
	})

	function submit(){
		const current = lists.value[numbers.value[number.value]]
		const ans = answer.value.join("")
		if(current?.answers.includes(ans)){
			score.value++
		}
		clear()
		number.value++
	}

	function clear(){
		answer.value = []
	}
	
	function appendKey(character: String){
		answer.value.push(character)
	}

	function space(){
		answer.value.push(" ")
	}

	function erase(){
		answer.value.pop()
	}

</script>

<template>
  <div class="h-dvh w-dvw bg-slate-100 flex flex-col items-center p-4 gap-2">
    <div class="flex flex-col w-[calc(75%-0.5rem)] gap-2">
      <div class="bg-white rounded shadow-lg p-6">
        <h1 class="text-3xl font-bold text-center">
          {{ lists[numbers[number]]?.qe ?? "" }}
        </h1>

        <p class="text-center text-slate-500">
          {{ lists[numbers[number]]?.qt ?? "" }}
        </p>
      </div>

      <div class="bg-white rounde shadow-lg p-2">
        <div class="flex flex-wrap justify-center items-center gap-2 min-h-[60px]">
          <div
  					v-for="(letter, index) in answer"
  					:key="index"
  					:class="[
    					'w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
    					letter === ' '
      					? 'border-0'
      					: 'border-2 border-slate-300'
  					]"
					>
  					{{ letter === ' ' ? '' : letter }}
					</div>
				</div>
      </div>

      <div
        class="bg-white rounded shadow-lg p-2
               grid grid-cols-13 sm:grid-cols-13 gap-2"
      >
        <Box
          v-for="(char_, index) in letters"
          :key="index"
          :text="char_"
          @click="appendKey(char_)"
        />
				<Box text="<-" @click="erase" />
				<Box class="col-span-13 p-2 !aspect-auto" text="Spacebar" @click="space" />
      </div>

      <div class="flex gap-3">
        <button
        	@click="clear"
          class="flex-1 py-4 rounded-2xl bg-slate-200
                 font-semibold hover:bg-slate-300"
        >
          Clear
        </button>

        <button
        	@click="submit"
          class="flex-1 py-4 rounded-2xl bg-blue-600 text-white
                 font-semibold hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
</template>
