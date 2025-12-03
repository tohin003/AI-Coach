"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    onLanguageChange?: (language: string) => void;
}

export function CodeEditor({ value, onChange, language = "javascript", onLanguageChange }: CodeEditorProps) {
    const editorRef = useRef<any>(null);
    // const [lang, setLang] = useState(language); // Removed useState for lang

    const handleLanguageChange = (newLang: string) => {
        if (onLanguageChange) {
            onLanguageChange(newLang);
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    return (
        <Card className="flex h-full flex-col overflow-hidden border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
                <span className="text-sm font-medium text-slate-600">Code Editor</span>
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="h-8 w-[140px] bg-white">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={language}
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    theme="vs-light"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                        padding: { top: 16 },
                    }}
                />
            </div>
        </Card>
    );
}
