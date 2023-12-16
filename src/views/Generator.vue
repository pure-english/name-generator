<!--
  Be WARNED!

  This is some of the WORST spaghetti code I've ever written. Fuck.
-->

<template>
  <div class="container mx-auto">
    <div class="prose">
      <h1 class="grow my-5">Anglish Name Generator</h1>
      <sub class="grow"><center>v1.5.0 (2023-12-16)</center></sub>
    </div>

    <div class="content-stretch mt-8" style="max-width: 20%; min-width: 265px;">
      <form>
        <label class="label cursor-pointer">
          <span class="label-text">Living names (218)</span>
          <input type="checkbox" class="checkbox" v-model="livingNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Last names (617)</span>
          <input type="checkbox" class="checkbox" v-model="lastNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Quickened/Revived names (2081)</span>
          <input type="checkbox" class="checkbox" v-model="quickenedNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Frozen/Old English names (12)</span>
          <input type="checkbox" class="checkbox" v-model="frozenNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Unfounded/Germanic names (59)</span>
          <input type="checkbox" class="checkbox" v-model="unfoundedNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Anglo-Norse Living names (4)</span>
          <input type="checkbox" class="checkbox" v-model="angloNorseLivingNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Anglo-Norse Last Names (14)</span>
          <input type="checkbox" class="checkbox" v-model="angloNorseLastNamesUsed">
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Anglo-Norse Quickened/Revived names (44)</span>
          <input type="checkbox" class="checkbox" v-model="angloNorseQuickenedNamesUsed">
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

    <div class="overflow-x-auto" v-if="generatedBefore">
      <table class="table table-pin-cols">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name (English/Anglish)</th>
            <th>Gender</th>
            <th>Whence</th>
            <th>Etymology</th>
            <th>Background</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(namePair, index) in generatedNamesTable" class="hover">
            <!-- {{ console.log(`index = ${index}`) }} -->
            
            <!-- Index -->
            <th>{{ index + 1 }}</th>

            <!-- English/Anglish Name -->
            <td v-if="lastNamesUsedOnly() && namePair.length > 1">
              <b>{{ namePair[1].english_name ?? "" }}</b><br/>
              <b v-if="namePair[0].english_name != namePair[0].anglish_name ||
              namePair[1].english_name != namePair[1].anglish_name">
                <span v-if="namePair[1]">
                  {{ namePair[1].anglish_name ?? "" }}
                </span>
              </b>
            </td>
            <td v-else-if="(lastNamesUsed || angloNorseLastNamesUsed) && namePair.length > 1">
              <b>
                {{ namePair[0].english_name ?? "" }}
                <span v-if="namePair[1]">
                  {{ namePair[1].english_name ?? "" }}
                </span>
              </b><br/>
              <b v-if="namePair[0].english_name != namePair[0].anglish_name ||
              (namePair[1] && namePair[1].english_name != namePair[1].anglish_name)">
                {{ namePair[0].anglish_name ?? "" }}
                <span v-if="namePair[1] != undefined">
                  {{ namePair[1].anglish_name ?? "" }}
                </span>
              </b>
            </td>
            <td v-else-if="namePair.length > 0">
              <b>{{ namePair[0].english_name ?? "" }}</b><br/>
              <b v-if="namePair[0].english_name != namePair[0].anglish_name">
                {{ namePair[0].anglish_name ?? "" }}
              </b>
            </td>

            <!-- Gender -->
            <td>
              <p v-if="showAllGenders">
                <span v-if="namePair.length > 0">
                  {{ namePair[0].english_name ?? "" }}: {{ namePair[0].kind ?? "" }}
                </span><br/>
                <span v-if="namePair.length > 1">
                  {{ namePair[1].english_name ?? "" }}: {{ namePair[1].kind ?? "" }}
                </span>
              </p>
              <p v-else>
                <span v-if="namePair.length > 0">
                  {{ namePair[0].kind ?? "" }}
                </span><br/>
              </p>
            </td>

            <!-- Whence -->
            <td>
              <p>
                <span v-if="namePair.length > 0">
                  {{ namePair[0].whence ?? "" }}
                </span><br/>
                <!-- <span v-if="namePair.length > 1">{{ namePair[1].english_name }}: {{ namePair[1].whence }}</span> -->
              </p>
            </td>

            <!-- Etymology -->
            <td>
              <span v-if="namePair[0].forebear">
                {{ namePair[0].forebear }}
              </span>

              <span v-if="namePair[0].foreword || namePair[0].afterword">
                (<span v-if="namePair[0].foreword">
                  {{ namePair[0].foreword }}
                </span>
                <span v-if="namePair[0].foreword && namePair[0].afterword">
                  <span> + </span>
                </span>
                <span v-if="namePair[0].afterword">
                  {{ namePair[0].afterword }}
                </span>)
              </span>

              <br v-if="namePair[0] && namePair[1]"/>

              <span v-if="namePair[1].forebear">
                {{ namePair[1].forebear }}
              </span>

              <span v-if="namePair[1].foreword || namePair[1].afterword">
                (<span v-if="namePair[1].foreword">
                  {{ namePair[1].foreword }}
                </span>
                <span v-if="namePair[1].foreword && namePair[1].afterword">
                  <span> + </span>
                </span>
                <span v-if="namePair[1].afterword">
                  {{ namePair[1].afterword }}
                </span>)
              </span>
            </td>

            <!-- Background -->
            <td style="max-width: 600px;">
              <b v-if="namePair[0].background">{{ namePair[0].english_name }}</b>
              <p v-if="namePair[0].background">{{ namePair[0].background }}</p>

              <br v-if="namePair[0].background"/>

              <b v-if="namePair[1].background">{{ namePair[1].english_name }}</b>
              <p v-if="namePair[1].background">{{ namePair[1].background }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

let anglishNames: Ref<NamesDict> = ref({});
let norseNames: Ref<NamesDict> = ref({});
let generatedNamesTable: Ref<NameEntry[][]> = ref([]);
let generatedBefore: Ref<boolean> = ref(false);

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
    anglishNames.value = data;
    console.log("Loaded names!");
  });

  const res2 = await fetch("/name-generator/anglo-norse_given_names.json");
  await res2.json().then((data: NamesDict) => {
    norseNames.value = data;
    console.log("Loaded Norse names!");
  });
}

getNames();

// console.log(`The type of names is ${typeof names}`);

let livingNamesUsed: Ref<boolean> = ref(true);
let lastNamesUsed: Ref<boolean> = ref(true);
let quickenedNamesUsed: Ref<boolean> = ref(true);
let frozenNamesUsed: Ref<boolean> = ref(false);
let unfoundedNamesUsed: Ref<boolean> = ref(false);
// Norse
let angloNorseLivingNamesUsed: Ref<boolean> = ref(false);
let angloNorseLastNamesUsed: Ref<boolean> = ref(false);
let angloNorseQuickenedNamesUsed: Ref<boolean> = ref(false);

let showAllGenders: Ref<boolean> = ref(false);

// let lastNamesUsedOnly: ComputedRef<boolean> = computed(() => {
//   return lastNamesUsed && (!livingNamesUsed && !quickenedNamesUsed && !frozenNamesUsed && !unfoundedNamesUsed);
// });

function lastNamesUsedOnly(): boolean {
  return lastNamesUsed && (!livingNamesUsed && !quickenedNamesUsed && !frozenNamesUsed && !unfoundedNamesUsed);
}

let sex: Ref<number> = ref(0);
let namesToGenerate: Ref<number> = ref(1);

function generateFirstName(num: number) {
  let namesPool: Array<NameEntry> = [];
  
  if (livingNamesUsed.value) {
    // console.log("Living names used!");
    namesPool = [
      ...anglishNames.value["Living"],
      ...namesPool,
    ]
  }

  if (quickenedNamesUsed.value) {
    // console.log("Quickened names used!");
    namesPool = [
      ...anglishNames.value["Quickened"],
      ...namesPool,
    ]
  }

  if (frozenNamesUsed.value) {
    // console.log("Frozen names used!");
    namesPool = [
      ...anglishNames.value["Frozen"],
      ...namesPool,
    ]
  }

  if (unfoundedNamesUsed.value) {
    // console.log("Unfounded names used!");
    namesPool = [
      ...anglishNames.value["Unfounded"],
      ...namesPool,
    ]
  }

  if (angloNorseLivingNamesUsed.value) {
    namesPool = [
      ...norseNames.value["Living"],
      ...namesPool,
    ]
  }

  // if (angloNorseLastNamesUsed.value) {
  //   namesPool = [
  //     ...norseNames.value["Lastname"],
  //     ...namesPool,
  //   ]
  // }

  if (angloNorseQuickenedNamesUsed.value) {
    namesPool = [
      ...norseNames.value["Quickened"],
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

  // Obscure bug where sometimes frozen and unfounded words will be glitched
  // console.log(`namesPool length = ${namesPool.length}`);

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
  if (!lastNamesUsed.value && !angloNorseLastNamesUsed.value) {
    return [];
  }

  let namesPool: Array<NameEntry> = [];

  if (lastNamesUsed.value) {
    namesPool = [
      ...anglishNames.value["Lastname"],
    ];
    // console.log(`namesPool = ${JSON.stringify(namesPool)}`);
  }

  if (angloNorseLastNamesUsed.value) {
    // console.log(`norseNames.value[Lastname] = ${JSON.stringify(norseNames.value["Lastname"])}`)

    namesPool = [
      ...norseNames.value["Lastname"],
      ...namesPool,
    ]
    // console.log(`namesPool = ${JSON.stringify(namesPool)}`);
  }

  let generatedNames: Array<NameEntry> = [];

  for (let i = 0; i < num; i++) {
    generatedNames.push(
      namesPool[(Math.floor(Math.random() * namesPool.length))]
    );
  }

  console.log(`generatedNames = ${JSON.stringify(generatedNames)}`);

  return generatedNames;
}

function generateNames() {
  if (!generatedBefore.value) {
    generatedBefore.value = true;
  }

  const numberOfNames = namesToGenerate.value;
  console.log(`Generating ${numberOfNames} names…`);

  const firstNames = generateFirstName(numberOfNames);
  const lastNames = generateLastName(numberOfNames);

  // If male or female or unisex etc

  const zippedNames = firstNames.map((left, idx) => [left ?? "", lastNames[idx]]);

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