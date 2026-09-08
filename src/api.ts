import type { TreeViewItem } from './types'
import { delay } from './utils'

export const getItems = async (): Promise<TreeViewItem[]> => {
  const response = await fetch('/data/items.json')
  const data = (await response.json()) as TreeViewItem[]
  await delay(2000)
  return data
}
