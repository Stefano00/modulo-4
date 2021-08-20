$('#js-form').submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value
    const JWT = await postData(email, password)
    const posts = await getData(JWT);
    if(Object(posts) != null){
        console.log(posts)
        //oculatr form  mostrar button
        $('#menu').hide();
        $('#menu-2').show();
        insertPhotos(posts);
    }
});

$('#js-morePhotos').click( async () => {
    console.log("Estoy en el button");
    morePhotos();
});

const insertPhotos = (data) => {
    const divPhotos = document.getElementById("photos");
    HTML = "";
    data.forEach((resp, index)=>{
        HTML += `<img src="${resp.download_url}" height="150" width="150" alt="photo${index}">`
    })
    divPhotos.innerHTML = HTML;
}

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

const getData = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/photos',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json();

        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

const morePhotos = async () => {
    console.log('hola');
    try{
        const jwt = localStorage.getItem('jwt-token');
        console.log(jwt);
        const response = await fetch('http://localhost:3000/api/photos?page=1',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json()
        console.log(data);
        return data
        
    }catch(err) {
        console.error(`Error: ${err}`);
    }
}
