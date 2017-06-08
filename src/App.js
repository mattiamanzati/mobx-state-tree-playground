import React, { Component } from "react";
import MonacoEditor from "react-monaco-editor";
import { observer } from "mobx-react";
import { runCode } from "./run";

class App extends Component {
  editor = null;
  viewer = null;
  state = { preview: null };

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

  editorWillMount = monaco => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true // This line disables errors in jsx tags like <div>, etc.
    });

    // I don't think the following makes any difference
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      // jsx: 'react',
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "React.createElement",
      reactNamespace: "React",
      allowNonTsExtensions: true,
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.Latest
    });
  };

  viewerDidMount = (editor, monaco) => {
    this.viewer = editor;
    this.resize();
  };

  componentDidMount() {
    window.onresize = this.resize;
    runCode(this.props.store, this.sandboxRender);
  }

  sandboxRender = element => {
    this.setState({ preview: element });
  };

  render() {
    const { store } = this.props;
    return (
      <div className="playground">
        <div className="toolbar">
          <div className="buttons run-code">
            <a href="#" onClick={() => runCode(store, this.sandboxRender)}>
              Run ►
            </a>
            <a
              href={"#" + store.shareUrl}
              onClick={() => (window.location.hash = store.shareUrl)}
            >
              Share
            </a>
          </div>
          {store.previewMode !== "react"
            ? <div className="buttons preview-navigation">
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
            : null}
          <div className="buttons preview-mode">
            <a
              href="#"
              className={store.previewMode === "react" ? "active" : ""}
              onClick={() => store.setPreviewMode("react")}
            >
              Preview
            </a>
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
            language="typescript"
            value={store.code}
            onChange={store.setCode}
            editorWillMount={this.editorWillMount}
            editorDidMount={this.editorDidMount}
          />
        </div>
        <div className="preview">
          {store.previewMode === "react"
            ? this.state.preview
            : store.currentPreview === null
              ? null
              : <MonacoEditor
                  language="json"
                  value={store.currentPreview}
                  options={{ readOnly: true }}
                  editorDidMount={this.viewerDidMount}
                />}
          {store.logs.length > 0
            ? <div className="logs">
                {store.logs.map(item =>
                  <div>{item.split("\n").map(t => <p>{t}</p>)}</div>
                )}
              </div>
            : null}
        </div>
      </div>
    );
  }
}

export default observer(App);
