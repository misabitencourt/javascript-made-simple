import el from '../../utils/create-element.js';

export default ({
    textContent,
    classList,
    attributes,
    onClick
}) => el({
    tag: 'button',
    classList: `button-common ${classList || ''}`,
    attributes,
    textContent,
    events: onClick ? [
        {event: 'click', listener: onClick}
    ] : undefined
});