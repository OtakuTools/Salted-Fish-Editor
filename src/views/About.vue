<template>
  <div class="about">
    <MarkdownEditor />
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    MarkdownEditor
  }
})
export default class Editor extends Vue {}
</script>
