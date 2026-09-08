import { reactive } from 'vue'
import type { TreeViewItem } from './types'

type Id = TreeViewItem['id']

type State = {
  items: TreeViewItem[]
}
export default class TreeStore {
  private _state = reactive<State>({
    items: [],
  })

  constructor(items: TreeViewItem[] = []) {
    this._state.items = items
  }

  public get items() {
    return this._state.items
  }

  private get _childrenMap() {
    const map = new Map<TreeViewItem['parent'], TreeViewItem[]>()

    for (const item of this.items) {
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
    return this.items
  }

  public getItem(id: Id) {
    const item = this.items.find((i) => i.id === id)
    return item ?? null
  }

  public getChildren(id: Id) {
    return this.items.filter((i) => i.parent === id)
  }

  public getAllChildren(id: Id) {
    const allChildren: TreeViewItem[] = []

    const queue = [...(this._childrenMap.get(id) ?? [])]
    let queuePointer = 0

    while (queuePointer < queue.length) {
      const currentChild = queue[queuePointer]

      if (currentChild) {
        allChildren.push(currentChild)

        const nextLevelChildren = this._childrenMap.get(currentChild.id)

        if (nextLevelChildren) {
          queue.push(...nextLevelChildren)
        }
      }

      queuePointer++
    }

    return allChildren
  }

  public getAllParents(id: Id) {
    const map = new Map<Id, TreeViewItem>()
    for (const item of this.items) {
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

    return [map.get(id), ...parents]
  }

  public setItems(items: TreeViewItem[]) {
    this._state.items = items
  }

  public addItem(item: TreeViewItem) {
    this._state.items.push(item)
  }

  public removeItem(id: Id) {
    const targetIds = [id, ...this.getAllChildren(id).map((i) => i.id)]
    this._state.items = this._state.items.filter((i) => !targetIds.includes(i.id))
  }

  public updateItem(item: TreeViewItem) {
    const index = this.items.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      this._state.items[index] = item
    }
  }
}
