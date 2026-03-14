document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.invoice-form-body');
    const select = document.getElementById('business_type');
    const container = document.getElementById('dynamic_fields_container');

    const statuses = [
        'Pending',
        'Unpaid',
        'paid',
        'Partially Paid',
        'Overdue',
        'Cancelled',
        'Refunded',
    ];

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

            if (!['discount', 'tax'].includes(field.name)) {
                const requiredStar = document.createElement('span');
                requiredStar.className = 'dashicons dashicons-star-filled required-star';
                label.appendChild(requiredStar);
            }

            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.className = 'form-control';
            input.placeholder = `Enter ${field.label}`;

            if (['fee', 'cost', 'rate', 'discount', 'tax'].includes(field.name)) {
                input.setAttribute('oninput', "this.value = this.value.replace(/[^0-9.]/g,'')");
            }

            const error = document.createElement('span');
            error.className = 'field-error';
            error.style.color = 'red';
            error.style.fontSize = '12px';
            error.style.display = 'none';
            error.textContent = `Please enter ${field.label.toLowerCase()}.`;

            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.style.borderColor = '#d1d5db';
                    if (error) error.style.display = 'none';
                }

                if (['fee', 'cost', 'rate', 'discount', 'tax'].includes(field.name)) {
                    const feeInput = container.querySelector('input[name="fee"]');
                    const costInput = container.querySelector('input[name="cost"]');
                    const rateInput = container.querySelector('input[name="rate"]');

                    const fee = parseFloat(feeInput?.value) || 0;
                    const cost = parseFloat(costInput?.value) || 0;
                    const rate = parseFloat(rateInput?.value) || 0;

                    if (fee !== 0 || cost !== 0 || rate !== 0) {
                        updateNetAmount();
                    } else {
                        const netAmountDiv = container.querySelector('.net-amount');
                        netAmountDiv.textContent = `Net Amount: $0.00`;
                    }
                }
            });
            group.appendChild(label);
            group.appendChild(input);

            if (!['discount', 'tax'].includes(field.name)) {
                group.appendChild(error);
            }

            if (field.name === 'fee' || field.name === 'cost' || field.name === 'rate') {
                const netAmountDiv = document.createElement('div');
                netAmountDiv.className = 'net-amount';
                netAmountDiv.style.marginTop = '5px';
                netAmountDiv.style.fontWeight = 'bold';
                netAmountDiv.textContent = 'Net Amount: $0.00';
                group.appendChild(netAmountDiv);
            }

            box.appendChild(group);
        });

        // Status field
        const statusGroup = document.createElement('div');
        statusGroup.className = 'invoice-field-group';
        const statusLabel = document.createElement('label');
        statusLabel.textContent = 'Status';
        const statusStar = document.createElement('span');
        statusStar.className = 'dashicons dashicons-star-filled required-star';
        statusLabel.appendChild(statusStar);

        const statusSelect = document.createElement('select');
        statusSelect.name = 'status';
        statusSelect.className = 'form-control';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Status';
        statusSelect.appendChild(defaultOption);

        statuses.forEach((s) => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
            statusSelect.appendChild(opt);
        });

        const statusError = document.createElement('span');
        statusError.className = 'field-error';
        statusError.style.color = 'red';
        statusError.style.fontSize = '12px';
        statusError.style.display = 'none';
        statusError.textContent = 'Please select a status.';

        statusSelect.addEventListener('change', () => {
            if (statusSelect.value.trim() !== '') {
                statusSelect.style.borderColor = '#d1d5db';
                statusError.style.display = 'none';
            }
        });

        statusGroup.appendChild(statusLabel);
        statusGroup.appendChild(statusSelect);
        statusGroup.appendChild(statusError);
        box.appendChild(statusGroup);

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
        const inputs = container.querySelectorAll('input, select');
        let valid = true;

        inputs.forEach((input) => {
            const error = input.nextElementSibling;

            if (['discount', 'tax'].includes(input.name)) {
                input.style.borderColor = '#d1d5db';
                return;
            }

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

    let netInput = container.querySelector('input[name="net_amount"]');
    if (!netInput) {
        netInput = document.createElement('input');
        netInput.type = 'hidden';
        netInput.name = 'net_amount';
        container.appendChild(netInput);
    }

    function updateNetAmount() {
        const feeInput = container.querySelector('input[name="fee"]');
        const costInput = container.querySelector('input[name="cost"]');
        const rateInput = container.querySelector('input[name="rate"]');
        const taxInput = container.querySelector('input[name="tax"]');
        const discountInput = container.querySelector('input[name="discount"]');
        const netAmountDiv = container.querySelector('.net-amount');

        const fee =
            parseFloat(feeInput?.value) ||
            parseFloat(costInput?.value) ||
            parseFloat(rateInput?.value) ||
            0;
        const tax = parseFloat(taxInput?.value) || 0;
        const discount = parseFloat(discountInput?.value) || 0;

        const net = fee + tax - discount;

        if (netAmountDiv) netAmountDiv.textContent = `Net Amount: $${net.toFixed(2)}`;
        if (netInput) netInput.value = net.toFixed(2);
    }
    form.addEventListener('submit', function (e) {
        const isDropdownValid = validateSelect();
        const areFieldsValid = validateDynamicFields();

        if (!isDropdownValid || !areFieldsValid) {
            e.preventDefault();
        }
    });
});
