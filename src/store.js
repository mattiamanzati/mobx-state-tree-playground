import { types as t } from "mobx-state-tree"

const DEFAULT_CODE = `import React from "react"
import { types } from "mobx-state-tree"
import { observer } from "mobx-react"
import { inspect, render } from "mobx-state-tree-playground"

const AppModel = types.model({
    count: types.optional(types.number, 0)
}).actions(self => ({
    increment(){
        self.count++
    },
	decrement() {
		self.count--
	}
}))

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
    fontSize: t.optional(t.number, 18)
}).views(self => ({

    get currentPreview(){
        return self.previewMode !== 'react' && self[self.previewMode].length > 0 && self[self.previewMode].length > self.currentPreviewIndex ? JSON.stringify(self[self.previewMode][self.currentPreviewIndex], null, 4) : null
    },

    get previewCount() {
        return self.previewMode === 'react' ? 0 : self[self.previewMode].length
    },

    get shareUrl() {
        return 'src=' + encodeURIComponent(self.code)
    }
})).actions(self => ({
    setCode(code){
        self.code = code
    },

    setPreviewMode(mode){
        self.currentPreviewIndex = 0
        self.previewMode = mode
        self.goLast()
    },

    setFontSize(increase){
        self.fontSize += increase
    },

    goFirst(){
        self.currentPreviewIndex = 0
    },
    goLast(){
        self.currentPreviewIndex = self.previewCount > 0 ? self.previewCount - 1 : 0
    },
    goPrevious(){
        self.currentPreviewIndex = self.currentPreviewIndex > 0 ? self.currentPreviewIndex - 1 : 0
    },
    goNext(){
        self.currentPreviewIndex = self.currentPreviewIndex >= self.previewCount - 1 ? self.previewCount - 1 : self.currentPreviewIndex + 1
    },
    clear(){
        self.currentPreviewIndex = 0
        self.snapshots = []
        self.patches = []
        self.actions = []
        self.logs = []
    },
    addSnapshot(snapshot) {
        self.snapshots.push(snapshot)
        self.goLast()
    },
    addPatch(patch){
        self.patches.push(patch)
        self.goLast()
    },
    addAction(action){
        self.actions.push(action)
        self.goLast()
    },
    addLog(log) {
        self.logs.push(log)
    }
}))

let code = window.location.hash.indexOf('src=') > 0 ? decodeURIComponent(window.location.hash.substring(window.location.hash.indexOf('src=') + 'src='.length)) : DEFAULT_CODE

const store = AppStore.create({
    code,
    previewMode: 'snapshots',
    currentPreviewIndex: 0,
    snapshots: [],
    patches: [],
    actions: [],
    logs: []
})

export default store