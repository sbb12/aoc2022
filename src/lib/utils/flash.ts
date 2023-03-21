export default function flash(element:HTMLElement, i:number = 0) {

    if (i > 25){
        return;
    }

    if (!isInViewport(element)) {
        setTimeout(() => {
            flash(element, i+1);
        }, 200);
        return;
    }

	requestAnimationFrame(() => {
		element.style.transition = 'none';
		element.style.color = 'rgba(255,62,0,1)';
		element.style.backgroundColor = 'rgba(255,62,0,0.2)';

		setTimeout(() => {
			element.style.transition = 'color 1s, background 1s';
			element.style.color = '';
			element.style.backgroundColor = '';
		});
	});
}


function isInViewport(element:HTMLElement) {
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}