document.getElementById('submit').addEventListener('click', () => {
    const client = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
    };

    const job = {
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
    };

    const location = {
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zip-code').value,
    };

    const schedule = {
        startDate: document.getElementById('start-date').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
    };

    fetch('http://localhost:1800/save-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, job, location, schedule }),
    })
        .then((response) => response.json())
        .then((data) => console.log('Deal saved:', data))
        .catch((error) => console.error('Error:', error));
});
