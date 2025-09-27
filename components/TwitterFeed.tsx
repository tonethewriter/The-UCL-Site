import React, { useEffect } from 'react';

declare global {
  interface Window {
    twttr: any;
  }
}

export const TwitterFeed: React.FC = () => {
    useEffect(() => {
        // This effect triggers the Twitter widget script to scan the DOM and render the timeline.
        // It's necessary for SPAs where the DOM changes without a full page reload.
        if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load(document.getElementById("twitter-widget-container"));
        }
    }, []);

    return (
        <div id="twitter-widget-container" className="bg-brand-surface p-4 rounded-lg shadow-md border border-brand-border/50">
            <h2 className="text-xl font-bold text-white mb-4">League Twitter Feed</h2>
            <a 
                className="twitter-timeline"
                data-theme="dark"
                data-height="800"
                data-chrome="noheader nofooter noborders transparent"
                href="https://twitter.com/ucsgotnext?ref_src=twsrc%5Etfw"
            >
                Tweets by ucsgotnext
            </a>
        </div>
    );
};