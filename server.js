var app = require('./app');
const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
	console.log('Server running on port: ' + PORT);
});