<template>
  <div
    :class="`vue-magnifier__magnifier ${className}`"
    :style="{
      width,
      height,
      overflow: mgShowOverflow ? 'visible' : 'hidden',
    }"
  >
    <img
      ref="img"
      :src="src"
      v-bind="$attrs"
      class="vue-magnifier__magnifier-image"
      style="width: 100%; height: 100%"
      :style="mgShow ? 'cursor: none' : ''"
      @load="onImageLoad($event)"
      @mouseenter="onMouseEnter()"
      @mousemove="onMouseMove($event)"
      @mouseout="onMouseOut()"
      @touchstart.prevent="onTouchStart($event)"
      @touchmove.prevent="onTouchMove($event)"
      @touchend="onTouchEnd()"
    />

    <div
      v-if="imgBounds && mgShow"
      :class="mgClasses"
      :style="magnifierStyles"
    />
  </div>
</template>

<script lang="ts">
import { $ref } from 'vue/macros'
import {
  computed,
  defineEmits,
  defineProps,
  withDefaults,
  onMounted,
  onUnmounted,
} from 'vue'

import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
type MgShape = 'circle' | 'square'

interface Props {
  // Image
  src: string
  width?: string | number
  height?: string | number
  className?: string

  // Zoom image
  zoomImgSrc?: string
  zoomFactor?: number

  // Magnifying glass
  mgWidth?: number
  mgHeight?: number
  mgBorderWidth?: number
  mgShape?: MgShape
  mgShowOverflow?: boolean
  mgMouseOffsetX?: number
  mgMouseOffsetY?: number
  mgTouchOffsetX?: number
  mgTouchOffsetY?: number

  // Custom prop for vue-magnifier to show or hide magnifying glass
  mgShow?: boolean
  // Custom prop for magnifying glass border background color
  mgCornerBgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  // Image
  src: '',
  width: '100%',
  height: 'auto',
  className: '',

  // Zoom image
  zoomImgSrc: '',
  zoomFactor: 1.5,

  // Magnifying glass
  mgWidth: 150,
  mgHeight: 150,
  mgBorderWidth: 2,
  mgShape: 'circle',
  mgShowOverflow: true,
  mgMouseOffsetX: 0,
  mgMouseOffsetY: 0,
  mgTouchOffsetX: -50,
  mgTouchOffsetY: -50,

  // Custom prop to show or hide magnifying glass
  mgShow: true,
  // Custom prop for magnifying glass border background color
  mgCornerBgColor: '#fff',
})

const {
  src,
  zoomImgSrc,
  zoomFactor,
  mgWidth,
  mgHeight,
  mgBorderWidth,
  mgShape,
  mgMouseOffsetX,
  mgMouseOffsetY,
  mgTouchOffsetX,
  mgTouchOffsetY,
  mgCornerBgColor,
} = props

// const emit = defineEmits(['image:load'])

const emit = defineEmits<{
  (e: 'image:load', event: Event): void
}>()

const img = $ref<HTMLImageElement>()

let imgBounds = $ref<DOMRect>()
let showZoom = $ref(false)
let mgOffsetX = $ref(0)
let mgOffsetY = $ref(0)
let relX = $ref(0)
let relY = $ref(0)

const mgClasses = computed(() => {
  let classes = 'vue-magnifier__magnifying-glass'

  if (showZoom) classes += ' vue-magnifier__visible'

  if (mgShape === 'circle') classes += ' vue-magnifier__circle'

  return classes
})

const magnifierStyles = computed(() => ({
  width: `${mgWidth}px`,
  height: `${mgHeight}px`,
  left: `calc(${relX * 100}% - ${
    mgWidth / 2
  }px + ${mgOffsetX}px - ${mgBorderWidth}px)`,
  top: `calc(${relY * 100}% - ${
    mgHeight / 2
  }px + ${mgOffsetY}px - ${mgBorderWidth}px)`,
  backgroundImage: `url(${zoomImgSrc || src})`,
  backgroundPosition: `calc(${relX * 100}% + ${mgWidth / 2}px - ${
    relX * mgWidth
  }px) calc(${relY * 100}% + ${mgHeight / 2}px - ${relY * mgWidth}px)`,
  backgroundSize: `${zoomFactor * imgBounds.width}% ${
    zoomFactor * imgBounds.height
  }%`,
  borderWidth: `${mgBorderWidth}px`,
  backgroundColor: mgCornerBgColor,
}))

const calcImgBounds = () => {
  if (img) {
    imgBounds = img.getBoundingClientRect()
  }
}

const onImageLoad = (event: Event) => {
  emit('image:load', event)

  calcImgBounds()
}

const onMouseEnter = () => {
  calcImgBounds()
}

let onMouseMove = (e: MouseEvent) => {
  // const { mgMouseOffsetX, mgMouseOffsetY } = props

  if (imgBounds) {
    const target = e.target as HTMLElement

    mgOffsetX = mgMouseOffsetX
    mgOffsetY = mgMouseOffsetY
    relX = (e.clientX - imgBounds.left) / target.clientWidth
    relY = (e.clientY - imgBounds.top) / target.clientHeight
    showZoom = true
  }
}

const onMouseOut = () => {
  showZoom = false
}

const onTouchStart = (e: TouchEvent) => {
  // e.preventDefault() // Prevent mouse event from being fired

  calcImgBounds()
}

let onTouchMove = (e: TouchEvent) => {
  // e.preventDefault() // Disable scroll on touch

  if (imgBounds) {
    const target = e.target as HTMLElement
    // const { mgTouchOffsetX, mgTouchOffsetY } = props
    const relXLocal =
      (e.targetTouches[0].clientX - imgBounds.left) / target.clientWidth
    const relYLocal =
      (e.targetTouches[0].clientY - imgBounds.top) / target.clientHeight

    // Only show magnifying glass if touch is inside image
    if (relXLocal >= 0 && relYLocal >= 0 && relXLocal <= 1 && relYLocal <= 1) {
      mgOffsetX = mgTouchOffsetX
      mgOffsetY = mgTouchOffsetY
      relX = relXLocal
      relY = relYLocal
      showZoom = true
    } else {
      showZoom = false
    }
  }
}

const onTouchEnd = () => {
  showZoom = false
}

const calcImgBoundsDebounced = debounce(calcImgBounds, 200)

onMouseMove = throttle(onMouseMove, 20, { trailing: false })
onTouchMove = throttle(onTouchMove, 20, { trailing: false })

const registerEventListeners = () => {
  // Re-calculate image bounds on window resize
  window.addEventListener('resize', calcImgBoundsDebounced)
  // Re-calculate image bounds on scroll (useCapture: catch scroll events in entire DOM)
  window.addEventListener('scroll', calcImgBoundsDebounced, true)
}

const unRegisterEventListeners = () => {
  // Remove all event listeners
  window.removeEventListener('resize', calcImgBoundsDebounced)
  window.removeEventListener('scroll', calcImgBoundsDebounced, true)
}

onMounted(() => {
  registerEventListeners()
})

onUnmounted(() => {
  unRegisterEventListeners()
})
</script>
