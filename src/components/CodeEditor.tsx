import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from './ui/button';
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from '@/config/config';
import { CODE_SNIPPETS } from '@/Constants/snippet';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTime } from '@/Context/TimeContext';
import { ScrollArea } from './ui/scroll-area';
import SmallLoader from './SmallLoader';

interface CodeSnippets {
    [key: string]: string;
}

interface CodeEditorProps {
    language: string;
    setLanguage: (language: string) => void;
    value: string;
    setValue: (value: string) => void;
    onSubmit?: () => void;
    isPractice?: boolean;
    loader2?: boolean;
}

export default function CodeEditor({ language, setLanguage, value, setValue, onSubmit, isPractice, loader2 }: CodeEditorProps) {

    const editorRef = useRef();
    const outputRef = useRef<any>(null);

    const [input, setInput] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [output, setOutput] = useState("");

    const [loading, setLoading] = useState(false);

    const { timeLeft } = useTime()

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }

    const runCode = async () => {
        // Run the code
        try {

            setSampleInput(input);
            setLoading(true);

            const res = await fetch(`${BACKEND_URL}/api/v1/code/runcode/${language}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: value, input: input }),
            });

            setLoading(false);

            const data = await res.json();

            setOutput(data.run.output); // Assuming the response contains an "output" field

            // Scroll to the output section
            if (outputRef.current) {
                outputRef.current.scrollIntoView({ behavior: 'smooth' });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
            <div className='p-4'>
                <div className='mb-4 flex'>
                    <Select value={language} onValueChange={(value) => {
                        setLanguage(value)
                        setValue((CODE_SNIPPETS as CodeSnippets)[value])
                    }
                    }>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Languages</SelectLabel>
                                <SelectItem value="javascript">javascript</SelectItem>
                                <SelectItem value="java">java</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                                <SelectItem value="python">python</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='ml-auto'>
                        <div className='flex 
                    justify-end
                    items-center
                    '>
                            {!isPractice ?
                                (
                                    <>
                                        <p className='font-semibold me-4'> Time Left : <span style={{ color: "#2563EB" }}>{timeLeft}</span></p>
                                        <Button onClick={onSubmit}>{!loader2 ? ("Run all Test Cases") : <SmallLoader /> }</Button>
                                    </>
                                )
                                :
                                (
                                    <Button onClick={onSubmit}>{!loader2 ? ("Run all Test Cases") : <SmallLoader /> }</Button>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className='rounded-lg border border-1 border-inherit shadow-sm bg-white'>
                        <Editor
                            height="60vh"
                            width="100%"
                            language={language}
                            theme='vs-dark'
                            onMount={onMount}
                            value={value}
                            onChange={(value: any) => setValue(value)}
                            defaultValue={(CODE_SNIPPETS as CodeSnippets)[language]}
                            options={{
                                fontSize: 16,
                                minimap: {
                                    enabled: false
                                },
                                contextmenu: false,
                            }}
                            className='p-2'
                        />
                    </div>
                    <div className='mt-4 rounded-lg border border-1 border-inherit px-4 shadow-sm bg-white'>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='mx-1'>Run custom test case</AccordionTrigger>
                                <AccordionContent className='m-1'>
                                    <Textarea
                                        placeholder="Type your input here."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className='min-h-48'
                                    />
                                    <div className='text-right mt-4'>
                                        <Button onClick={() => {
                                            runCode()
                                        }}>{!loading ? ("Run") : <SmallLoader /> }</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div ref={outputRef}>
                        {output ? (
                            <>
                                {sampleInput && (
                                    <div className='mt-4 rounded-lg border border-1 border-inherit p-4 shadow-sm bg-white'>
                                        <h1 className='text-lg font-semibold'>Custom Input</h1>
                                        <pre className="mt-2 w-[340px] rounded-md bg-slate-100 p-4">
                                            <code>{sampleInput}</code>
                                        </pre>
                                    </div>
                                )}
                                <div className='mt-4 rounded-lg border border-1 border-inherit p-4 shadow-sm bg-white'>
                                    <h1 className='text-lg font-semibold'>Output</h1>
                                    <pre className="mt-2 w-[340px] rounded-md bg-slate-100 p-4">
                                        <code>{output}</code>
                                    </pre>
                                </div>
                            </>
                        ) : (
                            <div className='mt-4 rounded-lg border border-1 border-inherit p-4 shadow-sm bg-white'>
                                <h1 className='text-lg font-semibold'>Output</h1>
                                <pre className="mt-2 w-[340px] rounded-md bg-slate-100 p-4">
                                    <code>Output will be displayed here.</code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div >
    )
}
