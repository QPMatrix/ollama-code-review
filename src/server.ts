import { serve } from 'bun';
import indexHtml from './index.html';

const server = serve({
	port: 3000,
	routes: {
		'/': indexHtml,
	},
	development: process.env.NODE_ENV !== 'production' && {
		hmr: true,
		console: true,
	},
	fetch(_request) {
		return new Response('Not found', { status: 404 });
	},
});

console.log(`🚀 Development server running at ${server.url}`);
