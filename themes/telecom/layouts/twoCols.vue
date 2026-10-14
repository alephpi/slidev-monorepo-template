<!--
  Usage:
```md
---
layout: two-cols-header
---
This spans both
::left::
# Left
This shows on the left
::right::
# Right
This shows on the right
::bottom::
This shows at the bottom, aligned to the end (bottom) of the grid

<style>
.two-cols-header {
  column-gap: 20px; /* Adjust the gap size as needed */
}
</style>
```
-->

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    class: {
        type: String,
    },
    layoutClass: {
        type: String,
    },
    // Left:right width ratio, e.g. "1:2"
    ratio: {
        type: String,
        default: '1:1',
    },
    gap: {
        type: String,
        default: '20px',
    },
})

const gridStyle = computed(() => {
    const [l, r] = props.ratio.split(':').map(Number)
    return {
        gridTemplateColumns: `minmax(0, ${l || 1}fr) minmax(0, ${r || 1}fr)`,
        columnGap: props.gap,
    }
})
</script>

<template>
    <div class="slidev-layout pageBar two-cols-header w-full h-full" :class="layoutClass" :style="gridStyle">
        <div class="absolute-blue-box"></div>
        <BarBottom :title="$slidev.configs.preTitleAbbr"
            :author="Object.keys($slidev.configs.authors[Object.keys($slidev.configs.authors)[0]])[0]"
            :meeting="$slidev.configs.meeting" />
        <div class="col-header">
            <slot />
        </div>
        <div class="col-left" :class="props.class">
            <slot name="left" />
        </div>
        <div class="col-right" :class="props.class">
            <slot name="right" />
        </div>
        <div class="col-bottom" :class="props.class">
            <slot name="bottom" />
        </div>
    </div>
</template>

<style scoped>
.two-cols-header {
    display: grid;
    grid-template-rows: auto auto 1fr;
    align-content: start;
}

.col-header {
    grid-area: 1 / 1 / 2 / 3;
}

.col-left {
    grid-area: 2 / 1 / 3 / 2;
}

.col-right {
    grid-area: 2 / 2 / 3 / 3;
}

.col-bottom {
    grid-area: 3 / 1 / 4 / 3;
}

.absolute-blue-box {
    position: absolute;
    top: 4%;
    left: 0;
    width: 3.5%;
    height: 5.5rem;
    background: linear-gradient(45deg, #FA3061 15%, #BF1238 45%);
    animation: gradient-animation 5s ease infinite;
    background-size: 200% 200%;
}

@keyframes gradient-animation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>