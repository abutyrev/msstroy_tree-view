import type { TreeViewItem } from './types'

type Id = TreeViewItem['id']

export default class TreeStore {
  private _items: TreeViewItem[] = []

  constructor(items: TreeViewItem[] = []) {
    this._items = items
  }

  public get items() {
    return [...this._items]
  }

  private get _childrenMap() {
    const map = new Map<TreeViewItem['parent'], TreeViewItem[]>()

    for (const item of this._items) {
      if (item.parent !== null) {
        if (!map.has(item.parent)) {
          map.set(item.parent, [])
        }
        map.get(item.parent)?.push(item)
      }
    }

    return map
  }

  public getAll() {
    return this._items.map((i) => ({ ...i }))
  }

  public getItem(id: Id) {
    const item = this._items.find((i) => i.id === id)
    return item ? { ...item } : null
  }

  public getChildren(id: Id) {
    return this._items.filter((i) => i.parent === id)
  }

  public getAllChildren(id: Id) {
    const allChildren: TreeViewItem[] = []

    const targetItems = [...(this._childrenMap.get(id) ?? [])]

    for (const item of targetItems) {
      allChildren.push({ ...item })
      const itemChildren = this._childrenMap.get(item.id)
      if (itemChildren) {
        allChildren.push(...itemChildren.map((i) => ({ ...i })))
      }
    }

    return allChildren
  }

  public getAllParents(id: Id) {
    const map = new Map<Id, TreeViewItem>()
    for (const item of this._items) {
      map.set(item.id, item)
    }

    if (!map.has(id)) return []

    const parents = []
    let target = map.get(id)

    while (target && target.parent !== null) {
      const parent = map.get(target.parent)
      if (parent) {
        parents.push(parent)
        target = parent
      } else {
        break
      }
    }

    return [{ ...map.get(id) }, ...parents.map((i) => ({ ...i }))]
  }

  public setItem(items: TreeViewItem[]) {
    this._items = items
  }

  public addItem(item: TreeViewItem) {
    this._items.push(item)
  }

  public removeItem(id: Id) {
    const targetIds = [id, this.getAllChildren(id).map((i) => i.id)]
    this._items = this._items.filter((i) => !targetIds.includes(i.id))
  }

  public updateItem(item: TreeViewItem) {
    const index = this._items.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      this._items[index] = item
    }
  }
}
