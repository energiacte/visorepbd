// Import CSS
import '../css/style.scss';

// Import React and JS
import HelloBox from './HelloBox';
import React from 'react';

console.log('Loaded the HelloBox component');

// Render!
React.render(<HelloBox />, document.getElementById('content'));
