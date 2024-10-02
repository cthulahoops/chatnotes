import ReactMarkdown from 'react-markdown';

export default function({ content, timestamp }: { content: string, timestamp: number }) {
  const date = new Date(timestamp);
  return (
    <article className="note">
      <ReactMarkdown>{content}</ReactMarkdown>
      {date &&
        <footer>
          <time dateTime={date.toISOString()}>
            {date.toLocaleString()}
          </time>
        </footer>
      }
    </article>
  );
};
