import React from 'react';

export const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '🔥', '😮', '😢'];

export const UCLPointIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const CommentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 0a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5h-11z" />
        <path d="M3 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" />
    </svg>
);

export const QuestionMarkIcon: React.FC = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.105-.448 2.105-1.172 2.828-.724.724-1.724 1.172-2.828 1.172-1.104 0-2.104-.448-2.828-1.172a3.986 3.986 0 01-1.172-2.828c0-1.105.448-2.105 1.172-2.828z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v.01" />
    </svg>
);

export const PayPalIcon: React.FC = () => (
    <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>PayPal</title>
        <path d="M7.064 6.421c.216-1.023 1.22-1.73 2.454-1.73h6.42c2.81 0 4.207 1.754 3.659 4.614-.548 2.86-2.453 4.31-4.962 4.31H9.986c-.548 0-.914.365-.73 1.092l1.64 4.568c.182.546.637.91 1.182.91h2.274c.455 0 .819-.273.91-.728l.455-2.273c.182-.82-.273-1.273-1.092-1.273H9.256c-1.365 0-2.365-.728-2.637-2.002-.273-1.273.454-2.183 1.545-2.183h8.37c1.545 0 2.454-.728 2.726-2.09.273-1.365-.455-2.183-1.636-2.183h-5.82c-1.454 0-2.272.819-2.545 2.002-.124.546-.6.82-1.143.728L7.065 6.42z" fill="#003087"/>
    </svg>
);

export const CreditCardIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const ApplePayIcon: React.FC = () => (
    <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Apple Pay</title>
        <path d="M18.89 12.005c0 1.94-1.205 3.033-3.111 3.033-1.859 0-2.82-1.01-4.223-1.01-.278 0-1.636.987-2.986.987-1.835 0-3.328-1.228-3.328-3.21s1.397-3.234 3.218-3.234c.99 0 2.242.73 3.44.73.189 0 2.071-.84 3.492-.84 1.779.023 3.498 1.345 3.498 3.545zM15.116 8.35c.023-1.812 1.467-2.843 3.111-2.933-.189.047-2.16 1.25-2.709 2.91zm-4.482-.862c.942-1.137 2.404-1.916 2.404-1.916s-1.467 1.835-2.266 2.843c-.776.987-1.489 2.583-1.489 2.583s-1.558-1.51-2.52-2.73c-1.08-.942-2.07-1.858-2.07-1.858s2.023.753 3.047 1.767c.189.188.82.707 1.161.942.34-.14.776-.42 1.185-.73z" fill="currentColor"/>
    </svg>
);
