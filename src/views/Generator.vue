<template>
  <!-- 
    Frozen: 11
​
    Lastname: 599
  ​
    Living: 215
    ​
    Quickened: 2059
    ​
    Unfounded: 59
  -->

  <div class="prose">
    <h1 class="grow">Anglish Name Generator</h1>
  </div>

  <div class=" flex center">
    <form action="">
      <label class="label cursor-pointer">
        <span class="label-text">Living names</span>
        <input type="checkbox" :checked="livingNamesUsed" class="checkbox">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Last names</span>
        <input type="checkbox" :checked="lastNamesUsed" class="checkbox">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Quickened names</span>
        <input type="checkbox" :checked="quickenedNamesUsed" class="checkbox">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Frozen names</span>
        <input type="checkbox" :checked="frozenNamesUsed" class="checkbox">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Unfounded names</span>
        <input type="checkbox" :checked="unfoundedNamesUsed" class="checkbox">
      </label>

      <input type="range" min="0" max="3" value="1" class="range" step="1" v-model="sex"/>
      <div class="w-full flex justify-between text-xs px-2">
        <span>All sexes</span>
        <span>Unisex</span>
        <span>Male</span>
        <span>Female</span>
      </div>

      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Number of names to generate</span>
        </div>
        <input type="text" placeholder="Number of names" class="input input-bordered w-full max-w-xs" v-model="namesToGenerate"/>
      </label>

      <button class="btn btn-active btn-primary" @click="generateNames" type="button">
        Generate Names
      </button>
    </form>
  </div>

  <div class="overflow-x-auto">
    <table class="table table-pin-cols">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>English Name</th>
          <th>Anglish Name</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="(namePair, index) in generatedNamesTable">
          <!-- {{ console.log(`index = ${index}`) }} -->
          <th>{{ index + 1 }}</th>
          <td>{{ namePair[0].english_name }} {{ namePair[1].english_name }}</td>
          <td>{{ namePair[0].anglish_name }} {{ namePair[1].anglish_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

let names: Ref<NamesDict> = ref({});
let generatedNamesTable: Ref<NameEntry[][]> = ref([]);

interface NameEntry {
  "english_name": string,
  "anglish_name": string,
  "kind": string,
  "whence": string,
  "forebear": string,
  "foreword": string,
  "afterword": string,
  "background": string,
}

interface NamesDict {
  [type: string]: Array<NameEntry>;
}

async function getNames() {
  const res = await fetch("../../anglish_given_names.json");
  await res.json().then((data: NamesDict) => {
    names.value = data;
    console.log("Loaded names!");
  });
}

getNames();

// console.log(`The type of names is ${typeof names}`);

let livingNamesUsed: Ref<boolean> = ref(true);
let lastNamesUsed: Ref<boolean> = ref(true);
let quickenedNamesUsed: Ref<boolean> = ref(true);
let frozenNamesUsed: Ref<boolean> = ref(false);
let unfoundedNamesUsed: Ref<boolean> = ref(false);

let sex: Ref<number> = ref(0);
let namesToGenerate: Ref<number> = ref(1);

function generateFirstName(num: number) {
  let namesPool: Array<NameEntry> = [];
  
  if (livingNamesUsed) {
    namesPool = [
      ...names.value["Living"],
      ...namesPool,
    ]
  }

  if (quickenedNamesUsed) {
    namesPool = [
      ...names.value["Quickened"],
      ...namesPool,
    ]
  }

  if (frozenNamesUsed) {
    namesPool = [
      ...names.value["Frozen"],
      ...namesPool,
    ]
  }

  if (unfoundedNamesUsed) {
    namesPool = [
      ...names.value["Unfounded"],
      ...namesPool,
    ]
  }

  let generatedNames: Array<NameEntry> = [];

  for (let i = 0; i < num; i++) {
    generatedNames.push(
      namesPool[(Math.floor(Math.random() * namesPool.length))]
    );
  }

  return generatedNames;
}

function generateLastName(num: number) {
  if (!lastNamesUsed) {
    return [];
  }

  let namesPool = names.value["Lastname"];

  let generatedNames: Array<NameEntry> = [];

  for (let i = 0; i < num; i++) {
    generatedNames.push(
      namesPool[(Math.floor(Math.random() * namesPool.length))]
    );
  }

  return generatedNames;
}

function generateNames() {
  const numberOfNames = namesToGenerate.value;
  console.log(`Generating ${numberOfNames} names…`);

  const firstNames = generateFirstName(numberOfNames);
  const lastNames = generateLastName(numberOfNames);

  const zippedNames = firstNames.map((left, idx) => [left, lastNames[idx]]);

  // console.log(zippedNames);
  // console.log(`typeof zipped is ${typeof zippedNames}`)

  generatedNamesTable.value = zippedNames;
}
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>