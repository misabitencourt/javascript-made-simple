
export const VALIDATION_REQUIRED = 1;

export default function validate(field, type) {
    switch (type) {
        case VALIDATION_REQUIRED:
            return !!`${field || ''}`.trim();
        default:
            return true;
    }
}
