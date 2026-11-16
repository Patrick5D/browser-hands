/**
 * [INPUT]: 隔离临时目录与 BacklinkStore。
 * [OUTPUT]: 验证日志脱离正文、复用基线与状态历史。
 * [POS]: 本地记录回归；不接触实际浏览器或用户记录。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test, expect } from 'bun:test'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BacklinkStore } from '../../server/backlinks'
import { textCandidates } from '../../server/jev'
test('记录动作但不写正文、令牌和上传内容；保留原始基线', () => {
  const root = mkdtempSync(join(tmpdir(), 'backlinks-'))
  try {
    const s = new BacklinkStore(root)
    s.context(1, 'example.com', 'RapperMaker', 'Katy')
    s.save('example.com', {recipe:{field:'#name'}})
    s.event('navigate',{tabId:1,url:'https://example.com/submit?token=SECRET'},10)
    s.event('javascript_tool',{tabId:1,text:'SECRET',files:[{data:'SECRET'}]},3,new Error('SECRET'))
    const log=readFileSync(join(root,'runs',readdirSync(join(root,'runs'))[0]),'utf8')
    expect(log).not.toContain('SECRET')
    expect(log).toContain('RapperMaker')
    expect(s.inspect(1,'https://example.com/submit',[{name:'name'}])).toContain('baseline captured')
    expect(s.inspect(1,'https://example.com/submit',[{name:'name'}])).toContain('structure matches')
    expect(s.inspect(1,'https://example.com/submit',[{name:'email'}])).toContain('form changed')
    expect(s.get('example.com').form).toEqual([{name:'name'}])
    s.status('example.com','RapperMaker','filled_not_submitted','a,b')
    expect(readFileSync(join(root,'submissions.csv'),'utf8')).toContain('"a,b"')
    expect(()=>s.get('../elsewhere')).toThrow()
  } finally { rmSync(root,{recursive:true,force:true}) }
})
test('明确字段保留逗号、句号与长介绍',()=>{
  const value='A video, with music. '+ 'Long description. '.repeat(20)
  expect(textCandidates('Description: '+value)).toContain(value.trim())
})
