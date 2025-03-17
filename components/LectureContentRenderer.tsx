import ReactMarkdown from "react-markdown";

interface LectureContentRendererProps {
	content: string;
}

export default function LectureContentRenderer({
	content,
}: LectureContentRendererProps) {
	return (
		<div className="prose max-w-none prose-headings:text-primary-color prose-a:text-primary-color prose-strong:font-semibold prose-blockquote:border-l-primary-color prose-blockquote:bg-primary-light prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md">
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
}
