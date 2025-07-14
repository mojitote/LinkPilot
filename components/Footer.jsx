export default function Footer() {
  return (
        <footer className="bg-white border-t border-gray-200 text-gray-500 text-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <span>&copy; {new Date().getFullYear()} LinkPilot. All rights reserved. </span>
            <span>Created by Xinghao Yuan</span>
            <span>Powered by Next.js &amp; HuggingFace</span>
          </div>
        </footer>
  );
}