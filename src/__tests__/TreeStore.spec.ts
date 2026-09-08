import { describe, it, expect, beforeEach } from 'vitest'
import TreeStore from '@/TreeStore'

const data = [
  { id: 1, parent: null, label: 'Item 1' },
  { id: 'test', parent: 1, label: 'Item 2' },
  { id: 3, parent: 1, label: 'Item 3' },
  { id: 4, parent: 'test', label: 'Item 4' },
  { id: 5, parent: 'test', label: 'Item 5' },
  { id: 6, parent: 'test', label: 'Item 6' },
  { id: 7, parent: 4, label: 'Item 7' },
  { id: 8, parent: 4, label: 'Item 8' },
]

const item1 = { id: 'test', parent: null, label: 'test label' }
const item2 = { id: 'test2', parent: null, label: 'test label 2' }
const item3 = { id: 3, parent: 'test2', label: 'test label 3' }
const item4 = { id: 4, parent: 3, label: 'test label 4' }
const item5 = { id: 5, parent: 3, label: 'test label 5' }

describe('TreeStore', () => {
  let treeStore: TreeStore

  beforeEach(() => {
    treeStore = new TreeStore([])
  })

  it('should initialize with correct default value', () => {
    expect(treeStore.getAll().length).toBe(0)
  })

  it('should set and return all items correctly', () => {
    treeStore.setItems(data)
    expect(treeStore.getAll()).toEqual(data)
  })

  it('should get item correctly by id', () => {
    treeStore.setItems(data)
    expect(treeStore.getItem(4)?.label).toBe('Item 4')
  })

  it('should add item correctly', () => {
    treeStore.addItem(item1)
    expect(treeStore.getAll().length).toBe(1)
    expect(treeStore.getAll()[0]).toEqual(item1)
  })

  it('should remove item correctly', () => {
    treeStore.setItems([item1, item2])
    treeStore.removeItem(item1.id)
    expect(treeStore.getAll().length).toBe(1)
    expect(treeStore.getAll()[0]).toEqual(item2)
  })

  it('should remove item and it descendants correctly', () => {
    treeStore.setItems([item1, item2, item3, item4])
    treeStore.removeItem(item2.id)
    expect(treeStore.getAll().length).toBe(1)
    expect(treeStore.getAll()[0]).toEqual(item1)
  })

  it('should update item correctly', () => {
    treeStore.setItems([item1])
    expect(treeStore.getItem(item1.id)?.label).toBe('test label')
    treeStore.updateItem({ ...item1, label: 'updated label' })
    expect(treeStore.getItem(item1.id)?.label).toBe('updated label')
  })

  it('should return children correctly', () => {
    treeStore.setItems([item1, item2, item3, item4, item5])
    expect(treeStore.getChildren(item3.id)).toEqual([item4, item5])
  })

  it('should return all descendants correclty', () => {
    treeStore.setItems([item1, item2, item3, item4, item5])
    expect(treeStore.getAllChildren(item2.id)).toEqual([item3, item4, item5])
  })

  it('should return all parents correctly with right order', () => {
    treeStore.setItems(data)
    const parents = treeStore.getAllParents(data[7]!.id)
    expect(parents.length).toBe(4)
    expect(parents[0]?.id).toBe(8)
    expect(parents[parents.length - 1]?.id).toBe(1)
  })
})
