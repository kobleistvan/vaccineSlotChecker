console.log('Login script injected...');

let data;

setTimeout(() => {
    data = JSON.parse(document.querySelector('#dataNode').getAttribute('logindata'));
}, 5000);

setTimeout(() => {
    if (data && data.status) {
        console.log('Filling out form values with the following data:', data);
        document.querySelector('form').__ngContext__[8].loginForm.controls.username.value = data.username;
        document.querySelector('form').__ngContext__[8].loginForm.controls.password.value = data.password;
        document.querySelector('form').__ngContext__[8].loginForm.status = "VALID";

        document.querySelector('form').click();
    }
}, 6000)

setTimeout(() => {
    if (data && data.status) {
        console.log('Attempting to log in...');
        document.querySelector('button').click();
    }
}, 7000)