

export default function el({
    tag,
    textContent,
    classList,
    children,
    events,
    attributes
}) {

    const element = document.createElement(tag || 'div');

    if (textContent) {
        element.textContent = textContent;
    }

    if (classList) {
        (classList+'').split(' ').filter(clazz => clazz.trim()).forEach(clazz => element.classList.add(clazz));
    }

    if (children) {
        children.forEach(child => element.appendChild(child));
    }

    if (events) {
        events.forEach(event => {
            element.addEventListener(event.event, event.listener);
        });
    }

    if (attributes) {
        attributes.forEach(attribute => {
            element.setAttribute(attribute.name, attribute.value);
        });
    }

    return element;
}