
$('#js-form').submit(async (event) => {
    $('.login').show();
    $('.logout').hide();
    event.preventDefault();
    const email = document.getElementById('js-input-email').value;
    const password = document.getElementById('js-input-password').value;
    const JWT = await postData(email, password);
    if (JWT != null) {
        window.location.replace('http://localhost:3000/covid19/index.html');
    }
});

$('#home').click(() => {
    console.log("hola");
    window.location.replace('http://localhost:3000/covid19/index.html');

});

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                //  mode: 'no-cors',
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}