import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    twttr: any;
  }
}

export const TwitterFeed: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const checkAndLoad = () => {
            if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.load(document.getElementById("twitter-widget-container"));
                if (isMounted) setIsLoading(false);
                return true;
            }
            return false;
        };
        
        if (checkAndLoad()) {
            return; // Already loaded
        }
    
        const intervalId = setInterval(() => {
            if (checkAndLoad()) {
                clearInterval(intervalId);
            }
        }, 100);
    
        // Cleanup
        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);


    return (
        <div id="twitter-widget-container" className="bg-brand-surface p-4 rounded-lg shadow-md border border-brand-border/50 min-h-[400px]">
            <h2 className="text-xl font-bold text-white mb-4">League Twitter Feed</h2>
            {isLoading && <p className="text-brand-text-muted">Loading tweets...</p>}
            <a 
                className="twitter-timeline"
                data-tweet-limit="5"
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