import React from "react";
import ReactMarkdown from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";

import "./Note.css";

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
          <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>
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
    if (prevChar === "(" || prevChar === "]") {
      return url;
    }
    return `[${url}](${url})`;
  });
}

function ExternalLink({
  children,
  ...props
}: { children?: React.ReactNode } & React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

type CodeBlockProps = {
  className?: string;
  children?: React.ReactNode;
};

function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  return match ? (
    <Highlight theme={themes.shadesOfPurple} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
