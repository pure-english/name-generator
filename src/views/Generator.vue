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

  <div class="flex center">
    <form>
      <label class="label cursor-pointer">
        <span class="label-text">Living names (215)</span>
        <input type="checkbox" class="checkbox" v-model="livingNamesUsed">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Last names (599)</span>
        <input type="checkbox" class="checkbox" v-model="lastNamesUsed">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Quickened/Revived names (2059)</span>
        <input type="checkbox" class="checkbox" v-model="quickenedNamesUsed">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Frozen/Old English names (11)</span>
        <input type="checkbox" class="checkbox" v-model="frozenNamesUsed">
      </label>

      <label class="label cursor-pointer">
        <span class="label-text">Unfounded/Germanic names (59)</span>
        <input type="checkbox" class="checkbox" v-model="unfoundedNamesUsed">
      </label>

      <input type="range" min="0" max="3" value="0" class="range mt-5" step="1" v-model="sex"/>
      <div class="w-full flex justify-between text-xs px-2">
        <span>Any</span>
        <span>Unisex</span>
        <span>Male</span>
        <span>Female</span>
      </div>

      <label class="form-control w-full max-w-xs my-5">
        <div class="label">
          <span class="label-text">Number of names to generate</span>
        </div>
        <input type="text" placeholder="Number of names" class="input input-bordered w-full max-w-xs" v-model="namesToGenerate"/>
      </label>

      <button class="btn btn-active btn-primary mb-5" @click="generateNames" type="button">
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
          <td v-if="lastNamesUsed && (!livingNamesUsed && !quickenedNamesUsed && !frozenNamesUsed && !unfoundedNamesUsed)">
            {{ namePair[1].english_name }}
          </td>
          <td v-else-if="lastNamesUsed">
            {{ namePair[0].english_name }} {{ namePair[1].english_name }}
          </td>
          <td v-else>
            {{ namePair[0].english_name }}
          </td>

          <td v-if="lastNamesUsed && (!livingNamesUsed && !quickenedNamesUsed && !frozenNamesUsed && !unfoundedNamesUsed)">
            {{ namePair[1].anglish_name }}
          </td>
          <td v-else-if="lastNamesUsed">
            {{ namePair[0].anglish_name }} {{ namePair[1].anglish_name }}
          </td>
          <td v-else>
            {{ namePair[0].anglish_name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

let names: Ref<NamesDict> = ref({});
let generatedNamesTable: Ref<NameEntry[][]> = ref([]);
let filteredNamesTable: Ref<NameEntry[][]> = ref([]);

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
  const res = await fetch("/name-generator/anglish_given_names.json");
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
  
  if (livingNamesUsed.value) {
    // console.log("Living names used!");
    namesPool = [
      ...names.value["Living"],
      ...namesPool,
    ]
  }

  if (quickenedNamesUsed.value) {
    // console.log("Quickened names used!");
    namesPool = [
      ...names.value["Quickened"],
      ...namesPool,
    ]
  }

  if (frozenNamesUsed.value) {
    // console.log("Frozen names used!");
    namesPool = [
      ...names.value["Frozen"],
      ...namesPool,
    ]
  }

  if (unfoundedNamesUsed.value) {
    // console.log("Unfounded names used!");
    namesPool = [
      ...names.value["Unfounded"],
      ...namesPool,
    ]
  }

  // Filter them by sex
  namesPool = namesPool.filter((name) => {
      if (sex.value == 0) {
        return name;
      } else if (name.kind == "Unisex" && sex.value == 1) {
        return name;
      } else if ((name.kind == "Male" || name.kind == "Unisex") && sex.value == 2) {  // Male
        return name;
      } else if ((name.kind == "Female" || name.kind == "Unisex") && sex.value == 3) { // Female
        return name;
      }
      // else {
      //   console.log(`Name did not match: ${name.english_name}\nkind: ${name.kind}\nsex value: ${sex.value}`);
      // }
  });

  let generatedNames: Array<NameEntry> = [];

  for (let i = 0; i < num; i++) {
    let name = namesPool[(Math.floor(Math.random() * namesPool.length))];
    
    // do {
    //   if (name.kind == "Unisex" && sex.value == 0) {
    //     break;
    //   } else if (name.kind == "Male" && sex.value == 1) {
    //     break;
    //   } else if (name.kind == "Female" && sex.value == 2) {
    //     break;
    //   } else {
    //     console.log(`Name did not match: ${name.english_name}\nkind: ${name.kind}\nsex value: ${sex.value}`);
    //     name = namesPool[(Math.floor(Math.random() * namesPool.length))];
    //   }
    // } while (true);
    
    generatedNames.push(name);
  }

  return generatedNames;
}

function generateLastName(num: number) {
  if (!lastNamesUsed.value) {
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

  // If male or female or unisex etc

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