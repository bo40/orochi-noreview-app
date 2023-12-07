import { css } from '../../../styled-system/css'
import { Block, BlockContentProps } from './block'
import { Smily } from './smily'
import { ElectronicSign } from './electronic-sign'
import { useState, ComponentProps, useEffect } from 'react'
import { getInitBlocks } from './get-init-blocks'

type Props = {
  cols: number
  rows: number
  bombs: number
}

type SmilyStatus = ComponentProps<typeof Smily>['status']

export const MineSweeper = ({ cols, rows, bombs }: Props) => {
  const [blocks, setBlocks] = useState<BlockContentProps[][]>([[]])
  const [smilyStatus, setSmilyStatus] = useState<SmilyStatus>('inprogress')

  useEffect(() => {
    const initBlocks = getInitBlocks({ cols, rows, bombs })
    setBlocks(initBlocks)
  }, [])

  const handleClick = (x: number, y: number) => {
    const tmpBlocks = blocks
    const block = tmpBlocks[y][x]
    if (block.open) return
    if (block.bomb) {
      setSmilyStatus('gameover')
      const overBlocks = tmpBlocks.map((row) =>
        row.map((b) => {
          b.open = true
          return b
        }),
      )
      setBlocks(overBlocks)
      return
    }
    const nextBlocks = tmpBlocks.map((r, ri) => {
      if (ri !== y) return r
      return r.map((b, bi) => {
        if (bi !== x) return b
        const tmpB = b
        tmpB.open = true
        return tmpB
      })
    })
    setBlocks(nextBlocks)
  }

  return (
    <div className={boxStyle}>
      <div className={statusBoxStyle}>
        <ElectronicSign num={bombs} />
        <Smily status={smilyStatus} />
        <ElectronicSign num={bombs} />
      </div>
      <div className={gameFieldStyle}>
        {blocks.map((row, y) => {
          return (
            <div key={`row-${y}`} className={gameFieldRowStyle}>
              {row.map((block, x) => {
                return (
                  <Block
                    key={`block-${x}.${y}`}
                    x={y}
                    y={x}
                    onClick={handleClick}
                    block={block}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const boxStyle = css({
  padding: '1.5rem',
  border: 'solid 2px gray',
})

const gameFieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
})

const gameFieldRowStyle = css({
  display: 'flex',
})

const statusBoxStyle = css({
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})
