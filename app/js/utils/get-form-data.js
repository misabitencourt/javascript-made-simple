
export default formElement => {
    const formData = {};
    Array.from(formElement.querySelectorAll('input, select, textarea')).forEach(input => {
        formData[input.name] = input.value;
    });

    return formData;
}