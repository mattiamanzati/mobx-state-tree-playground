import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import { observer } from "mobx-react";
import { transpile, runCode } from "./run";

class App extends Component {
  editor = null;
  viewer = null;

  resize = () => {
    if (this.editor) {
      this.editor.layout();
    }
    if (this.viewer) {
      this.viewer.layout();
    }
  };

  editorDidMount = (editor, monaco) => {
    this.editor = editor;
    this.resize();
  };

  viewerDidMount = (editor, monaco) => {
    this.viewer = editor;
    this.resize();
  };

  componentDidMount() {
    window.onresize = this.resize;
  }

  render() {
    const { store } = this.props;
    return (
      <div className="playground">
        <div className="toolbar">
          <div className="buttons run-code">
            <a href="#" onClick={() => runCode(store)}>
              Run ►
            </a>
            <a href={"#" + store.shareUrl} onClick={() => (window.location.hash = store.shareUrl)}>
              Share
            </a>
          </div>
          <div className="buttons preview-navigation">
            <a href="#" onClick={store.goFirst}>
              ⇤
            </a>
            <a href="#" onClick={store.goPrevious}>
              ←
            </a>
            <span>
              {store.previewCount > 0 ? store.currentPreviewIndex + 1 : 0}
              {" "}
              of
              {" "}
              {store.previewCount}
            </span>
            <a href="#" onClick={store.goNext}>
              →
            </a>
            <a href="#" onClick={store.goLast}>
              ⇥
            </a>
          </div>
          <div className="buttons preview-mode">
            <a
              href="#"
              className={store.previewMode === "snapshots" ? "active" : ""}
              onClick={() => store.setPreviewMode("snapshots")}
            >
              Snapshots
            </a>
            <a
              href="#"
              className={store.previewMode === "patches" ? "active" : ""}
              onClick={() => store.setPreviewMode("patches")}
            >
              Patches
            </a>
            <a
              href="#"
              className={store.previewMode === "actions" ? "active" : ""}
              onClick={() => store.setPreviewMode("actions")}
            >
              Actions
            </a>
          </div>
        </div>
        <div className="code">
          <MonacoEditor
            width="100%"
            height="100%"
            language="javascript"
            value={store.code}
            onChange={store.setCode}
            editorDidMount={this.editorDidMount}
          />
        </div>
        <div className="preview">
          {store.currentPreview === null
            ? null
            : <MonacoEditor
                language="json"
                value={store.currentPreview}
                options={{ readOnly: true }}
                editorDidMount={this.viewerDidMount}
              />}
          {store.logs.length > 0
            ? <div className="logs">{store.logs.map(item => <div>{item.split("\n").map(t => <p>{t}</p>)}</div>)}</div>
            : null}
        </div>
      </div>
    );
  }
}

export default observer(App);
