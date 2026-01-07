import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p className="mb-2 md:mb-0">
          Lost & Found System v2.0 • Powered by Levenshtein Distance Algorithm
        </p>
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;