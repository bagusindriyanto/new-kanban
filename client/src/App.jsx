import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import './App.css';

function App() {
  return (
    <>
      <h1 className="text-red-600">This is Heading 1</h1>
      <div className="bg-green-500 text-white mx-auto p-4">
        This is centered using the mx-auto class.
      </div>
      <div className="bg-teal-700 text-white mx-auto p-4 mt-2">
        Another centered section with a different classes.
      </div>
      <div className="bg-red-700 text-white mx-auto my-2 px-20">
        This section has horizontal padding of 50.
      </div>
      <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <ChatBubbleLeftRightIcon className="size-11 text-teal-300" />
        <div>
          <div className="text-xl font-medium text-black dark:text-white">
            ChitChat
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            You have a new message!
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
