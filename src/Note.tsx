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

  const preprocessedContent = preprocessMarkdown(content);
  return (
    <div className="note">
      <div>
        <ReactMarkdown
          components={{
            code: CodeBlock,
            a: ExternalLink,
          }}
        >
          {preprocessedContent}
        </ReactMarkdown>
      </div>
      {date && (
        <footer>
          <time dateTime={date.toISOString()}>
            {date.toLocaleString()}
          </time>
        </footer>
      )}
    </div>
  );
}

const urlRegex = /(https?:\/\/[^\s\]()]+)/g;

function preprocessMarkdown(content: string) {
  return content.replace(urlRegex, (url) => {
    // Avoid replacing URLs that are already part of a Markdown link
    const prevChar = content[content.indexOf(url) - 1];
    if (prevChar === '(' || prevChar === ']') {
      return url;
    }
    return `[${url}](${url})`;
  });
}

function ExternalLink({ children, ...props }: { children?: React.ReactNode } & React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
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
