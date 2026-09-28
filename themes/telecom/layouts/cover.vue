<script setup lang="ts">
import { handleAuthor } from './layoutHelper';


const props = defineProps({
  authors: {
    type: Object as () => Record<string, string>,
    default: () => ({})
  },
  meeting: {
    type: String,
    default: '',
  },
  preTitle: {
    type: String,
    default: 'An Example Title',
  },
  preDate: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
});


console.log('title:', props.preTitle);
console.log('meeting:', props.meeting);
console.log('author:', props.authors);


// Process authors from dictionary to author name as key, and author affiliation as value
const authorList: string[] = props.authors.map(author => Object.keys(author)[0]);

const [authorsDict, instituteDict] = handleAuthor(props.authors);
console.log(authorsDict);
console.log(instituteDict);

</script>

<template>
  <div class="slidev-layout cover">
    <div class="my-auto w-full">
      <div class="text-white text-4xl font-bold">{{ props.preTitle }}</div>
      <br>
      <p class="text-white italic">{{ props.meeting }}</p>
      <br>
      <div v-if="authorList.length" class="">
        <p v-if="authorList.length">
          <template v-for="(author, idx) in authorList">
            <span style="color: white">{{ author }}</span>
            <sup v-if="authorsDict[author].instituteNum.length > 0">
              <template v-for="(num, index) in authorsDict[author].instituteNum">
                <span v-if="index > 0">, </span>
                <span style="color: white">{{ num }}</span>
              </template>
            </sup>
            <span style="color: white" v-if="(idx < authorList.length - 1 && authorList.length >= 3)">, </span>
            <!-- <span v-if="idx === authorList.length - 2">,</span> -->
          </template>
        </p>
        <p v-if="preDate" id="date" style="color: white">{{ preDate }}</p>
      </div>

      <slot> </slot>
      <div v-if="Object.keys(instituteDict).length" class="institute-list">
        <p v-for="(name, num) in instituteDict" :key="num" style="color: white; font-size: 1em;">
          {{ name["number"] }}: {{ name["content"] }}
        </p>
      </div>
      <!-- <FootNote :filled="false" :separator="true" x="l" :footnotes="instituteDict" /> -->
      <img id="adasp" src="../public/adasp_red_whitebg_300px.png">
      <img id="telecom" src="../public/logo-telecom_ip_transp.svg"> </img>


    </div>
  </div>
</template>
<style>
.cover {
  background: linear-gradient(to bottom, #BF1238, #FA3061);
  background-attachment: fixed;
}

#adasp {
  width: 180px;
  position: absolute;
  left: 6%;
  bottom: 4%;
}

#telecom {
  width: 180px;
  position: absolute;
  right: 3%;
  bottom: 4%;
}
</style>