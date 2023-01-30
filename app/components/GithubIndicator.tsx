import { Github } from 'lucide-react';

export default function GithubIndicator() {
  return (
    <a
      href="https://github.com/8bittitan/nexus"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-8 right-8 bg-slate-700 p-2 rounded-full shadow-md"
    >
      <span className="sr-only">View project on GitHub</span>
      <Github />
    </a>
  );
}