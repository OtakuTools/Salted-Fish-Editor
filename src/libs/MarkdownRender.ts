import hljs from 'highlight.js'
// import { math_plugin } from '@/plugins/Plugin_Math'
// import { mark_plugin } from '@/plugins/Plugin_Mark'
// import { sub_plugin } from '@/plugins/Plugin_Sub'
// import { sup_plugin } from '@/plugins/Plugin_Sup'
// import { ins_plugin } from '@/plugins/Plugin_Ins'
const { math_plugin } = require('@/plugins/Plugin_Math')
const { mark_plugin } = require('@/plugins/Plugin_Mark')
const { sub_plugin } = require('@/plugins/Plugin_Sub')
const { sup_plugin } = require('@/plugins/Plugin_Sup')
const { ins_plugin } = require('@/plugins/Plugin_Ins')

class AstNode {
  attrs: any
  block: any
  children: any
  content: any
  hidden: any
  info: any
  level: any
  map: any
  markup: any
  meta: any
  nesting: any
  tag: any
  type: any
}

export class MarkdownRender {
  mdRender: any = null
  echartRender: any = null
  mermaidRender: any = null
  flowchartRender: any = null
  katexRender: any = null

  sandboxProxies: any = null
  sandbox: any = {}

  echartList: any = []
  flowchartList: any = []
  historySignArray: Array<string> = []

  CONTAINER_CLASS_NAME = 'preview_block'

  constructor (mdRender: any, echartRender: any, mermaidRender: any, flowchartRender: any, katexRender: any) {
    this.mdRender = mdRender
    this.echartRender = echartRender
    this.mermaidRender = mermaidRender
    this.flowchartRender = flowchartRender
    this.katexRender = katexRender

    this.sandboxProxies = new WeakMap()
    this.sandbox = {
      window: {},
      Object,
      JSON,
      Math,
      console,
      document,
      option: {}
    }

    this.mdRender.use(math_plugin, {
      inlineOpen: '$',
      inlineClose: '$',
      blockOpen: '$$',
      blockClose: '$$'
    }).use(
      mark_plugin
    ).use(
      sub_plugin
    ).use(
      sup_plugin
    ).use(
      ins_plugin
    )
  }

  render (code: string, DomId: string): void {
    this.echartList = []
    this.flowchartList = []
    const ast: Array<AstNode> = this.parse(code)
    const astBlockArray: Array<any> = []

    let nesting = 0
    let blocks: Array<AstNode> = []

    // ast分块
    for (let i = 0; i < ast.length; i++) {
      const astNode: AstNode = ast[i]
      nesting += astNode.nesting
      if (nesting > 0) {
        blocks.push(astNode)
      } else {
        blocks.push(astNode)
        astBlockArray.push(blocks)
        blocks = []
      }
    }

    // console.log(astBlockArray)

    // ast分块生成签名
    const signArray: Array<string> = []
    const codeArray: Array<string> = []
    for (let i = 0; i < astBlockArray.length; i++) {
      const block = astBlockArray[i]
      const codeStrArr: Array<string> = []
      let codeStr = ''
      const parentTags: Array<Record<string, any>> = []
      for (const node of block) {
        if (/open/.test(node.type)) {
          parentTags.unshift({ tag: node.tag, pos: codeStrArr.length })
          codeStrArr.push(`<${node.tag}>`)
        } else if (/close/.test(node.type)) {
          codeStrArr.push(`</${node.tag}>`)
          parentTags.shift()
        } else if (/inline/.test(node.type)) {
          if (node.children && node.children.length) {
            const c: any = this._renderInlineNode(node.children, parentTags)
            const uTag: any = c.updateTag
            if (Object.hasOwnProperty.call(uTag, 'pos')) {
              codeStrArr[uTag.pos] = codeStrArr[uTag.pos].replace(/^<(.*)>$/, `<$1 class="${uTag.cls}">`)
            }
            codeStrArr.push(c.text)
          } else {
            codeStrArr.push(node.content)
          }
        } else if (/fence/.test(node.type)) {
          codeStrArr.push(`<${node.tag} class="language-${node.info}">${node.content}</${node.tag}>`)
        } else if (/hr/.test(node.type)) {
          codeStrArr.push('<hr/>')
        } else if (/math_block/.test(node.type)) {
          codeStrArr.push(`${this.katexRender.renderToString(node.content, { displayMode: true })}`)
        }
      }
      codeStr = codeStrArr.join('')
      signArray.push(codeStr)
      codeArray.push(codeStr)
    }

    let oriChangeNodes: Array<number> = []
    let newChangeNodes: Array<number> = []
    const newLen = signArray.length
    const hisLen = this.historySignArray.length

    if (hisLen === 0) {
      oriChangeNodes = [0, -1]
      newChangeNodes = newLen === 0 ? [0, 0] : [0, newLen - 1]
    } else if (newLen === 0) {
      oriChangeNodes = hisLen === 0 ? [0, 0] : [0, hisLen - 1]
      newChangeNodes = [0, -1]
    } else if (newLen !== hisLen) {
      // 渲染块数量不一致，说明新建或移除了段落
      let newFrontPtr = 0
      let hisFrontPtr = 0

      while (newFrontPtr < newLen && hisFrontPtr < hisLen && signArray[newFrontPtr] === this.historySignArray[hisFrontPtr]) {
        newFrontPtr++
        hisFrontPtr++
      }

      const newArr = signArray.filter((item, index) => (index >= newFrontPtr))
      const hisArr = this.historySignArray.filter((item, index) => (index >= hisFrontPtr))

      let newBackPtr: number = newArr.length - 1
      let hisBackPtr: number = hisArr.length - 1

      while (newBackPtr > 0 && hisBackPtr > 0 && newArr[newBackPtr] === hisArr[hisBackPtr]) {
        newBackPtr--
        hisBackPtr--
      }

      newBackPtr += newFrontPtr
      hisBackPtr += hisFrontPtr

      oriChangeNodes = [hisFrontPtr, hisBackPtr]
      newChangeNodes = [newFrontPtr, newBackPtr]
    } else {
      // 渲染块数量一致，说明段落内容出现变化
      for (let i = 0; i < newLen; i++) {
        if (signArray[i] !== this.historySignArray[i]) {
          oriChangeNodes = [i, i]
          newChangeNodes = [i, i]
          break
        }
      }
    }

    if (!(oriChangeNodes.length > 0 && newChangeNodes.length > 0)) {
      return
    }

    const changePos = oriChangeNodes[0]
    const changeNum = newChangeNodes[1] - oriChangeNodes[1]

    let blockDom = document.querySelectorAll(`.${this.CONTAINER_CLASS_NAME}`)
    const container = document.getElementById(DomId)
    const frag = document.createDocumentFragment()

    if (!container) {
      return
    }

    for (let idx = 0; idx <= changeNum && (idx + changePos) < codeArray.length; idx++) {
      const b = document.createElement('div')
      b.className = this.CONTAINER_CLASS_NAME
      b.innerHTML = codeArray[idx + changePos]
      this._renderNode(b)
      frag.appendChild(b)
    }
    if (blockDom.length === 0 || changePos >= blockDom.length) {
      container.appendChild(frag)
    } else {
      if (changeNum < 0) {
        for (let i = 0; i < -changeNum; i++) {
          container.removeChild(blockDom[changePos + i])
        }
        blockDom = document.querySelectorAll(`.${this.CONTAINER_CLASS_NAME}`)
        if (newChangeNodes[1] >= 0 && newChangeNodes[0] >= 0) {
          for (let i = newChangeNodes[0]; i <= newChangeNodes[1]; i++) {
            if (signArray[i] !== this.historySignArray[i]) {
              blockDom[i].innerHTML = codeArray[i]
              this._renderNode(blockDom[i])
            }
          }
        } else {
          container.insertBefore(frag, blockDom[newChangeNodes[1]])
        }
      } else {
        container.replaceChild(frag, blockDom[changePos])
      }
    }
    this.updateCharts()
    this.historySignArray = signArray
  }

  diffContent (text1: string, text2: string): boolean {
    const len1: number = text1.length
    const len2: number = text2.length
    if (len1 !== len2) {
      return false
    } else {
      const diff = (left = 0, right: number = len1 - 1): boolean => {
        if (left > right) {
          return true
        }
        const mid = Math.floor(left + (right - left) / 2)
        if (text1[mid] !== text2[mid]) {
          return false
        } else {
          return diff(left, mid - 1) && diff(mid + 1, right)
        }
      }
      return diff()
    }
  }

  _renderInlineNode (nodes: Array<AstNode>, parents: Array<any>): object {
    const listTagPos: number = parents.findIndex((parent: any) => parent.tag === 'li')

    const renderArr: Array<string> = []

    const blocks: Array<AstNode> = []
    const dfsArr: Array<AstNode> = []

    for (const node of nodes) {
      dfsArr.push(node)
    }

    while (dfsArr.length) {
      const q = dfsArr.shift()
      if (!q) break
      if (q.children && q.children.length) {
        for (const node of q.children) {
          dfsArr.unshift(node)
        }
      }
      blocks.push(q)
    }

    let newTagInfo: any = {}
    for (let i = 0; i < blocks.length;) {
      const block: any = blocks[i]
      if (block.type === 'image') {
        renderArr.push(`<${block.tag} src="${block.attrs[0][1]}" alt="${block.content}" />`)
        i += 2
        continue
      } else if (block.type === 'text') {
        if (i === 0) {
          const t: string = block.content.replace(
            listTagPos !== -1 ? /^\[(x|\s)\](?=\s)/ig : '',
            ($2: string) => {
              if (listTagPos !== -1) {
                newTagInfo = { ...parents[listTagPos], cls: 'md-checkbox-list' }
                return `<input type="checkbox" ${$2.indexOf('x') !== -1 || $2.indexOf('X') !== -1 ? 'checked' : ''}></input>`
              } else {
                return ''
              }
            })
          renderArr.push(t)
        } else {
          renderArr.push(block.content)
        }
      } else if (block.type === 'softbreak') {
        renderArr.push(`<${block.tag} />`)
      } else if (block.type === 'link_open') {
        renderArr.push(`<${block.tag} class="md-link" href="${block.attrs[0][1]}">`)
      } else if (/open/.test(block.type)) {
        renderArr.push(`<${block.tag}>`)
      } else if (/close/.test(block.type)) {
        renderArr.push(`</${block.tag}>`)
      } else if (/math/.test(block.type)) {
        renderArr.push(this.katexRender.renderToString(block.content, { displayMode: false }))
      } else if (/code/.test(block.type)) {
        renderArr.push(`<${block.tag}>${block.content}</${block.tag}>`)
      }
      i++
    }

    return {
      text: renderArr.join(''),
      updateTag: newTagInfo
    }
  }

  _renderNode (node: Element) {
    const cnode = node.children[0]
    const renderCode = cnode.textContent
    try {
      if (cnode.className === 'language-mermaid') {
        const f = (svgCode: string) => {
          cnode.innerHTML = svgCode
        }
        this.mermaidRender.render(`mermaid_${new Date().getTime()}`, renderCode, f)
      } else if (cnode.className === 'language-echarts') {
        const chart: any = this.echartRender.init(cnode)
        let option: any = {}
        option = this.compileCode(renderCode)(this.sandbox)
        chart.setOption(option)
        this.echartList.push({ node: chart, size: option.size || { width: 500, height: 300 } })
      } else if (cnode.className === 'language-flowchart') {
        const chart: any = this.flowchartRender.parse(renderCode)
        cnode.textContent = ''
        this.flowchartList.push({ node: cnode, chart })
      } else if (/^language-.*/.test(cnode.className)) {
        hljs.highlightBlock(cnode as HTMLElement)
      }
    } catch (err) {

    }
  }

  updateCharts () {
    this.echartList.forEach((item: any) => {
      item.node.resize(item.size)
    })
    this.flowchartList.forEach((item: any) => {
      item.chart.drawSVG(item.node)
    })
  }

  parse (code: string): Array<AstNode> {
    return this.mdRender.parse(code, {})
  }

  compileCode (src: string | null) {
    src = 'with (sandbox) { ' + src + '}'
    const code = new Function('sandbox', src)

    function has (target: any, key: any) {
      return true
    }

    function get (target: any, key: any) {
      if (key === Symbol.unscopables) return undefined
      return target[key]
    }

    return (sandbox: object) => {
      if (!this.sandboxProxies.has(sandbox)) {
        const sandboxProxy = new Proxy(sandbox, { has, get })
        this.sandboxProxies.set(sandbox, sandboxProxy)
      }
      const sbp: any = this.sandboxProxies.get(sandbox)
      code(sbp)
      return sbp.option
    }
  }
}
