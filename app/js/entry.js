// Import CSS
import '../css/style.scss';

// Import React and JS
import React from 'react';
import HelloBox from './HelloBox';

console.log('Loaded the HelloBox component');

// Render!
React.render(<HelloBox />, document.getElementById('content'));
