console.log('Login script injected...');

let data;

// Attempt after a while to get the data we've put into the dummy DIV element. We do it this way, because we can't read them from the cookie storage, since they're 2 different storages. (AFAIK, I might be wrong, but this works.)
setTimeout(() => {
    data = JSON.parse(document.querySelector('#dataNode').getAttribute('logindata'));
}, 5000);

/**
 * The login form is made with Angular's form builder & uses pristine, dirty, status, etc. flags to actually call the login action. Just by simply targetig the DOM
 * from the external script & setting the values of the input fields with the correct credentials will not trigger the validation methods to log in.
 * We bypass this safety mechanism through this injected script in which we can target directly the flags within __ngContext__.
 */
setTimeout(() => {
    if (data && data.status) {
        console.log('Filling out form values with the following data:', data);
        document.querySelector('form').__ngContext__[8].loginForm.controls.username.value = data.username;
        document.querySelector('form').__ngContext__[8].loginForm.controls.password.value = data.password;
        document.querySelector('form').__ngContext__[8].loginForm.status = "VALID";

        document.querySelector('form').click(); // No real reason, just to mess with the recaptcha script :)
    }
}, 6000)

// Log in
setTimeout(() => {
    if (data && data.status) {
        console.log('Attempting to log in...');
        document.querySelector('button').click();
    }
}, 7000)