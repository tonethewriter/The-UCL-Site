import React from 'react';

export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-1 1v1a1 1 0 102 0V8a1 1 0 00-1-1zM9 12a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
    </svg>
);

export const UCLPointIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.158-.103.346-.195.577-.291 1.253-.503 2.642.022 3.493 1.02.78 1.039.81 2.334.214 3.395a2.5 2.5 0 01-3.707.214 2.5 2.5 0 01-.214-3.707c.23-.306.52-1.076 1.02-1.631.503-.555.628-1.02.214-1.02-.414 0-1.04.59-1.454 1.214" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.75 5.146a.75.75 0 01.043 1.06L3.109 7.854a.75.75 0 11-1.06-1.06l1.637-1.648a.75.75 0 011.06.044zM16.89 12.146a.75.75 0 11-1.06 1.06l-1.648-1.637a.75.75 0 011.06-1.06l1.648 1.637z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

export const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.02-3.06A8.005 8.005 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.416 14.65A6.002 6.002 0 0010 15c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6c0 1.282.404 2.47 1.09 3.447l.26.42-.16 1.48-1.48.16.42.26z" clipRule="evenodd" />
    </svg>
);

export const PayPalIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.353 21c.54 0 .88-.34.993-.9l2.09-12.532c.113-.66.653-1.014 1.32-1.014h5.313c4.133 0 6.64 2.144 5.92 6.13-.533 3.022-2.3 4.81-4.993 4.81h-2.183l-.407 2.454c-.113.66-.54 1.013-1.207 1.013H3.353zm5.02-11.233c-.113-.567-.34-1.134-.993-1.134H5.613l-1.133 6.79h2.3c.667 0 1.1-.34 1.207-.9l.34-2.757h.04zm7.252 2.3c.427-2.143-.88-3.4-3.133-3.4H9.68l.88 5.153h.994c2.273 0 3.353-.9 2.92-4.053z" fill="#009cde"/>
    </svg>
);

export const CreditCardIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 6h16v2H4V6zm0 12v-6h16.001l.001 6H4z" fill="currentColor"/>
    </svg>
);

export const ApplePayIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50.41 33.55c.14-11.39-8.42-16.7-9.3-17.06-.5-.19-1.03.04-1.26.5-.23.47-.04.97.43 1.22.47.24 7.69 4.39 7.55 13.9-2.12.33-4.52 1.58-6.16 3.82-1.9 2.6-3.18 5.94-2.82 9.25.96 8.95 8.32 12.8 11.56 12.8 3.2 0 4.1-1.6 7.6-1.6 3.44 0 4.63 1.6 7.84 1.6 3.32 0 10.3-4.32 11.25-13.6-5.23-3.12-8.9-7.53-8.69-12.73zM45.5 12.35c2.4-2.83 4.14-6.8 3.73-10.7-3.48.1-7.1 2.3-9.52 5.13-2.1 2.5-4.4 6.7-3.9 10.4 3.9.2 7.28-2.04 9.7-4.83z" fill="currentColor"/>
    </svg>
);