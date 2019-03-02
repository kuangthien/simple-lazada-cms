import _ from 'lodash';
import CMS from 'netlify-cms';

// Now the registry is available via the CMS object.
//  CMS.registerPreviewTemplate('my-template', MyTemplate)
function component() {
	let element = document.createElement('div');

	// Lodash, currently included via a script, is required for this line to work
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');


	return element;
}

document.body.appendChild(CMS);

document.body.appendChild(component());
