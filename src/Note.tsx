import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './Note.css';

interface NoteProps {
  content: string;
  timestamp: number;
}

export default function Note({ content, timestamp }: NoteProps) {
  const date = new Date(timestamp);

  return (
    <>
      <div>
        <ReactMarkdown
          components={{
            code: CodeBlock
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {date && (
        <footer>
          <time dateTime={date.toISOString()}>
            {date.toLocaleString()}
          </time>
        </footer>
      )}
    </>
  );
}

type CodeBlockProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
