'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    dataKey: string;
    width: number;
    height: number;
    className?: string;
}

export default function AdBanner({ dataKey, width, height, className = '' }: AdBannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = ''; // Clear previous content

        const iframe = document.createElement('iframe');
        iframe.width = width.toString();
        iframe.height = height.toString();
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';

        container.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        const scriptContent = `
            <script type="text/javascript">
                atOptions = {
                    'key' : '${dataKey}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/${dataKey}/invoke.js"></script>
        `;

        doc.open();
        doc.write(`
            <html>
                <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;">
                    ${scriptContent}
                </body>
            </html>
        `);
        doc.close();

    }, [dataKey, width, height]);

    return (
        <div
            ref={containerRef}
            className={`flex items-center justify-center overflow-hidden ${className}`}
            style={{ width, height }}
        />
    );
}
