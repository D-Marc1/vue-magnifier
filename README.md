# vue-magnifier

[![Npm package version](https://img.shields.io/npm/v/@websitebeaver/vue-magnifier/latest.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@websitebeaver/vue-magnifier) [![license-image](https://img.shields.io/github/license/WebsiteBeaver/vue-magnifier?style=for-the-badge)](https://github.com/WebsiteBeaver/vue-magnifier/blob/master/LICENSE)

This is a Vue 3 adaptation of [react-magnifier](https://github.com/samuelmeuli/react-magnifier), which is the original version. Someone else made a Svelte version, called [svelte-magnifier](https://github.com/supercoww/svelte-magnifier) as well.

**Vue image zoom component**

- Simple and customizable
- Supports touch screens
- Allows different files for large image and magnifying glass (e.g. thumbnail and high-resolution image)

→ **[Demo](https://githubbox.com/WebsiteBeaver/vue-magnifier)**

<div style="text-align: center">
  <img src="https://raw.githubusercontent.com/WebsiteBeaver/vue-magnifier/d8cdfa26b08348a223b54105faa9c9767f15798f/images/demo.gif" alt="Demo" style="width: 600px" />
</div>

## Usage

Install the package using NPM:

```bash
npm install @websitebeaver/vue-magnifier
```

Add the component to your Vue application:

```vue
<script setup lang="ts">
import VueMagnifier from '@websitebeaver/vue-magnifier'
import '@websitebeaver/vue-magnifier/styles.css'
</script>

<template>
  <VueMagnifier src="./path/to/image" width="500" />
</template>
```

## Props

| Prop             | Type          | Default    | Description |
| ---------------- | ------------- | ---------- | ----------- |
| `src` (required) | String        | –          | URL/path of the large image                                                                                                                                      |
| `height`         | Number/String | `'auto'`   | Image height (absolute or relative values possible)                                                                                                              |
| `width`          | Number/String | `'100%'`   | Image width (absolute or relative values possible)                                                                                                               |
| `className`      | String        | `''`       | Class which will be applied to the image wrapper                                                                                                                 |
| `zoomImgSrc`     | String        | –          | URL/path of the image inside the magnifying glass (if not specified, the large image will be used)                                                               |
| `zoomFactor`     | Number        | `1.5`      | Factor by which the zoom image will be scaled (based on the size of the large image)                                                                             |
| `mgWidth`        | Number        | `150`      | Width of the magnifying glass in px                                                                                                                              |
| `mgHeight`       | Number        | `150`      | Height of the magnifying glass in px                                                                                                                             |
| `mgBorderWidth`  | Number        | `2`        | Border width of the magnifying glass in px                                                                                                                       |
| `mgShape`        | String        | `'circle'` | Shape of the magnifying glass (possible values: `'circle'`, `'square'`)                                                                                          |
| `mgShowOverflow` | Boolean       | `true`     | Set this to `false` to cut off the magnifying glass at the image borders. When disabling `mgShowOverflow`, it's recommended that you also set all offsets to `0` |
| `mgMouseOffsetX` | Number        | `0`        | Horizontal offset of the magnifying glass in px when hovering with a mouse                                                                                       |
| `mgMouseOffsetY` | Number        | `0`        | Vertical offset of the magnifying glass in px when hovering with a mouse                                                                                         |
| `mgTouchOffsetX` | Number        | `-50`      | Horizontal offset of the magnifying glass in px when dragging on a touch screen                                                                                  |
| `mgTouchOffsetY` | Number        | `-50`      | Vertical offset of the magnifying glass in px when dragging on a touch screen                                                                                    |
| `mgShow`         | Boolean       | `true`     | Show or hide magnifying glass. Doesn't exist in React or Svelte version. |
| `mgCornerBgColor` | String | `#fff`   | Magnifying glass corner background color. Doesn't exist in React or Svelte version. |

Any other props will be passed down to the `<img>` element. This way, you can e.g. add an `alt` attribute to the image.

## Events

| Event            | Type          | Value | Description |
| ---------------- | ------------- | ----- | ----------- |
| `image:load`     | `Event`       | -     | On image load. Doesn't exist in React or Svelte version. |

## Custom styling

```css
.vue-magnifier__magnifier {
  /* Styles for <div> around image and magnifying glass */
}
.vue-magnifier__magnifying-glass {
  /* Styles for magnifying glass */
}
.vue-magnifier__magnifying-glass.vue-magnifier__circle {
  /* Styles for magnifying glass circle */
}
.vue-magnifier__magnifying-glass.vue-magnifier__visible {
  /* Styles for magnifying glass visible */
}
```
