document.addEventListener('DOMContentLoaded', function () {
    const type = document.getElementById('business_type');

    type.addEventListener('change', function () {
        document.getElementById('doctor_fields').style.display = 'none';
        document.getElementById('freelancer_fields').style.display = 'none';

        if (this.value === 'doctor') {
            document.getElementById('doctor_fields').style.display = 'block';
        }

        if (this.value === 'freelancer') {
            document.getElementById('freelancer_fields').style.display = 'block';
        }
    });
});
