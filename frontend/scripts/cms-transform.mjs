import { createHash } from 'node:crypto'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'
import generatorModule from '@babel/generator'
import * as t from '@babel/types'

const traverse = traverseModule.default || traverseModule
const generate = generatorModule.default || generatorModule
const editableProperties = new Set([
  'title', 'heading', 'subheading', 'subtitle', 'description',
  'excerpt', 'label', 'question', 'answer', 'text', 'cta',
  'buttonText', 'category', 'readTime',
])

function normalizeJsxText(value) {
  const lines = value.replace(/\r\n?/g, '\n').split('\n')
  let result = ''
  for (let index = 0; index < lines.length; index += 1) {
    let line = lines[index].replace(/\t/g, ' ')
    if (index > 0) line = line.replace(/^ +/, '')
    if (index < lines.length - 1) line = line.replace(/ +$/, '')
    if (!line) continue
    result += line
    if (index < lines.length - 1) result += ' '
  }
  return result
}

function elementName(path) {
  const name = path.node.name
  return t.isJSXIdentifier(name) ? name.name : ''
}

function metaName(path) {
  const attributes = path.node.attributes || []
  const marker = attributes.find((attribute) =>
    t.isJSXAttribute(attribute) &&
    ['name', 'property', 'rel'].includes(attribute.name.name) &&
    t.isStringLiteral(attribute.value)
  )
  return marker?.value?.value || ''
}

export function isCmsSource(id) {
  const path = id.replaceAll('\\', '/').split('?')[0]
  if (!path.includes('/frontend/src/')) return false
  if (path.includes('/src/cms/') || path.includes('/src/components/ui/')) return false
  if (path.includes('/src/services/') || path.includes('/src/utils/')) return false
  if (/\/pages\/.*backup/i.test(path)) return false
  return /\.[jt]sx?$/.test(path)
}

export function transformCmsSource(source, id) {
  const normalizedPath = id.replaceAll('\\', '/').split('?')[0]
  const file = normalizedPath.split('/frontend/src/')[1]
  const fields = new Map()
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] })
  let changed = false

  function callFor(fallback, scope, kind) {
    if (!fallback.trim()) return null
    const hash = createHash('sha256')
      .update(`${file}|\0|${scope}|\0|${fallback.trim()}`)
      .digest('hex')
      .slice(0, 20)
    const key = `cms_${hash}`
    fields.set(key, { key, file, kind, default: fallback })
    changed = true
    return t.callExpression(t.identifier('cmsText'), [
      t.stringLiteral(key),
      t.stringLiteral(fallback),
    ])
  }

  traverse(ast, {
    JSXText(path) {
      const parent = path.parentPath
      let kind = 'text'
      if (parent.isJSXElement()) {
        const tag = elementName(parent.node.openingElement.name ? parent.get('openingElement') : parent)
        if (tag === 'style' || tag === 'script') return
        if (tag === 'title') kind = 'seo'
      }
      const fallback = normalizeJsxText(path.node.value)
      const call = callFor(fallback, 'jsx-text', kind)
      if (call) path.replaceWith(t.jsxExpressionContainer(call))
    },
    JSXExpressionContainer(path) {
      if (!path.parentPath.isJSXElement()) return
      if (!t.isStringLiteral(path.node.expression)) return
      const call = callFor(path.node.expression.value, 'jsx-expression', 'text')
      if (call) path.node.expression = call
    },
    JSXAttribute(path) {
      if (!t.isStringLiteral(path.node.value)) return
      const name = path.node.name.name
      const tagPath = path.parentPath
      const tag = elementName(tagPath)
      let kind = null
      if (['alt', 'placeholder', 'aria-label', 'title'].includes(name)) kind = 'text'
      if (name === 'content' && tag === 'meta') kind = 'seo'
      if (name === 'href' && tag === 'link') kind = 'seo'
      if (name === 'href' && tag === 'a') kind = 'link'
      if ((name === 'src' && ['img', 'video', 'source'].includes(tag)) || (name === 'poster' && tag === 'video')) kind = 'asset'
      if (!kind) return
      const marker = tag === 'meta' || tag === 'link' ? metaName(tagPath) : ''
      const call = callFor(path.node.value.value, `attribute:${tag}:${name}:${marker}`, kind)
      if (call) path.node.value = t.jsxExpressionContainer(kind === 'asset' ? t.callExpression(t.identifier('cmsAsset'), [call]) : call)
    },
    ObjectProperty(path) {
      if (!t.isStringLiteral(path.node.value)) return
      const key = t.isIdentifier(path.node.key) ? path.node.key.name
        : t.isStringLiteral(path.node.key) ? path.node.key.value : ''
      if (!editableProperties.has(key) && key !== 'logo') return
      const call = callFor(path.node.value.value, `property:${key}`, key === 'logo' ? 'asset' : 'text')
      if (call) path.node.value = key === 'logo' ? t.callExpression(t.identifier('cmsAsset'), [call]) : call
    },
  })

  if (!changed) return { code: source, fields: [] }
  ast.program.body.unshift(t.importDeclaration(
    [t.importSpecifier(t.identifier('cmsText'), t.identifier('cmsText')), t.importSpecifier(t.identifier('cmsAsset'), t.identifier('cmsAsset'))],
    t.stringLiteral('@/cms/client'),
  ))
  return {
    code: generate(ast, { comments: true, retainLines: true }, source).code,
    fields: [...fields.values()],
  }
}