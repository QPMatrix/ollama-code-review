import indexHtml from './index.html';

Bun.serve({
	port: 3000,
	routes: {
		'/': indexHtml,
	},
	development: {
		hmr: true,
		console: true,
	},
	fetch(_request) {
		return new Response('Not found', { status: 404 });
	},
});

console.log('🚀 Development server running at http://localhost:3000');
