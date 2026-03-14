document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.invoice-form-body');
    const select = document.getElementById('business_type');
    const container = document.getElementById('dynamic_fields_container');

    // Function to render dynamic fields
    function renderFields(businessId) {
        container.innerHTML = '';
        const selected = professions.find((p) => p.id === businessId);
        if (!selected) return;

        const box = document.createElement('div');
        box.className = 'dynamic-fields-box';

        selected.fields.forEach((field) => {
            const group = document.createElement('div');
            group.className = 'invoice-field-group';

            const label = document.createElement('label');
            label.textContent = field.label;

            const requiredStar = document.createElement('span');
            requiredStar.className = 'dashicons dashicons-star-filled required-star';
            label.appendChild(requiredStar);

            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.className = 'form-control';

            if (['fee', 'cost', 'rate'].includes(field.name)) {
                input.setAttribute('oninput', "this.value = this.value.replace(/[^0-9]/g, '')");
            }

            const error = document.createElement('span');
            error.className = 'field-error';
            error.style.color = 'red';
            error.style.fontSize = '12px';
            error.style.display = 'none';
            error.textContent = `Please enter ${field.label.toLowerCase()}.`;

            // Show/hide error on input
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.style.borderColor = '#d1d5db';
                    error.style.display = 'none';
                }
            });

            group.appendChild(label);
            group.appendChild(input);
            group.appendChild(error);
            box.appendChild(group);
        });

        container.appendChild(box);
    }

    select.addEventListener('change', function () {
        renderFields(this.value);
        validateSelect();
    });

    function validateSelect() {
        const errorId = 'business-type-error';
        let error = document.getElementById(errorId);

        if (!select.value) {
            select.style.borderColor = 'red';

            if (!error) {
                error = document.createElement('span');
                error.id = errorId;
                error.style.color = 'red';
                error.style.fontSize = '12px';
                error.textContent = 'Please select a business type.';
                select.parentNode.appendChild(error);
            }
            return false;
        } else {
            select.style.borderColor = '#d1d5db';
            if (error) error.remove();
            return true;
        }
    }

    function validateDynamicFields() {
        const inputs = container.querySelectorAll('input');
        let valid = true;

        inputs.forEach((input) => {
            const error = input.nextElementSibling;
            if (input.value.trim() === '') {
                valid = false;
                input.style.borderColor = 'red';
                if (error) error.style.display = 'block';
            } else {
                input.style.borderColor = '#d1d5db';
                if (error) error.style.display = 'none';
            }
        });

        return valid;
    }

    // On form submit
    form.addEventListener('submit', function (e) {
        const isDropdownValid = validateSelect();
        const areFieldsValid = validateDynamicFields();

        if (!isDropdownValid || !areFieldsValid) {
            e.preventDefault();
        }
    });
});
