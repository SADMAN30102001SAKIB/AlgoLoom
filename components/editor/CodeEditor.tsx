"use client";

import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  language: "python" | "cpp" | "javascript" | "java";
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  theme?: "vs-dark" | "github-dark";
}

export function CodeEditor({
  language,
  defaultValue,
  onChange,
  readOnly = false,
  theme = "vs-dark",
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const languageMap = {
    python: "python",
    cpp: "cpp",
    javascript: "javascript",
    java: "java",
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      lineNumbers: "on",
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      automaticLayout: true,
    });

    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editor.lineHighlightBackground": "#161b22",
        "editorLineNumber.foreground": "#6e7681",
        "editorLineNumber.activeForeground": "#c9d1d9",
      },
    });
  };

  return (
    <div className="h-full w-full border border-border overflow-hidden">
      <Editor
        height="100%"
        language={languageMap[language]}
        defaultValue={defaultValue}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
        options={{
          readOnly,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
      />
    </div>
  );
}
