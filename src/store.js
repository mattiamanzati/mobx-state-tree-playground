import { types as t } from "mobx-state-tree"

const DEFAULT_CODE = `import React from "react"
import { types } from "mobx-state-tree"
import { observer } from "mobx-react"
import { inspect, render } from "mobx-state-tree-playground"

const AppModel = types.model({
    count: types.optional(types.number, 0)
}, {
    increment(){
        this.count++
    },
	decrement() {
		this.count--
	}
})

const store = AppModel.create()
inspect(store)

const App = observer(
    props => <div>
        My awesome counter: 
        <button onClick={() => props.store.decrement()}>-</button> 
        {props.store.count} 
        <button onClick={() => props.store.increment()}>+</button> 
    </div>
)

render(<App store={store} />)
`;

const AppStore = t.model({
    code: t.string,

    previewMode: t.union(...['react', 'snapshots', 'patches', 'actions'].map(t.literal)),
    snapshots: t.array(t.frozen),
    patches: t.array(t.frozen),
    actions: t.array(t.frozen),
    logs: t.array(t.string),

    currentPreviewIndex: t.number,

    get currentPreview(){
        return this.previewMode !== 'react' && this[this.previewMode].length > 0 && this[this.previewMode].length > this.currentPreviewIndex ? JSON.stringify(this[this.previewMode][this.currentPreviewIndex], null, 4) : null
    },

    get previewCount() {
        return this.previewMode === 'react' ? 0 : this[this.previewMode].length
    },

    get shareUrl() {
        return 'src=' + encodeURIComponent(this.code)
    }
}, {
    setCode(code){
        this.code = code
    },

    setPreviewMode(mode){
        this.currentPreviewIndex = 0
        this.previewMode = mode
        this.goLast()
    },

    goFirst(){
        this.currentPreviewIndex = 0
    },
    goLast(){
        this.currentPreviewIndex = this.previewCount > 0 ? this.previewCount - 1 : 0
    },
    goPrevious(){
        this.currentPreviewIndex = this.currentPreviewIndex > 0 ? this.currentPreviewIndex - 1 : 0
    },
    goNext(){
        this.currentPreviewIndex = this.currentPreviewIndex >= this.previewCount - 1 ? this.previewCount - 1 : this.currentPreviewIndex + 1
    },
    clear(){
        this.currentPreviewIndex = 0
        this.snapshots = []
        this.patches = []
        this.actions = []
        this.logs = []
    },
    addSnapshot(snapshot) {
        this.snapshots.push(snapshot)
        this.goLast()
    },
    addPatch(patch){
        this.patches.push(patch)
        this.goLast()
    },
    addAction(action){
        this.actions.push(action)
        this.goLast()
    },
    addLog(log) {
        this.logs.push(log)
    }
})

let code = window.location.hash.indexOf('src=') > 0 ? decodeURIComponent(window.location.hash.substring(window.location.hash.indexOf('src=') + 'src='.length)) : DEFAULT_CODE

export default AppStore.create({
    code,
    previewMode: 'snapshots',
    currentPreviewIndex: 0,
    snapshots: [],
    patches: [],
    actions: [],
    logs: []
})