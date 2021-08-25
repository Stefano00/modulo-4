var page = 0;
$('#logout').hide();

$('#js-form').submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value
    const JWT = await postData(email, password)
    page = 1;
    const posts = await getData(JWT, page);
    if(Object(posts) != null){
        console.log(posts)
        //oculatr form  mostrar button
        $('#menu').hide();
        $('#menu-2').show();
        $('#logout').show();
        insertPhotos(posts);
    }
});

$('#js-morePhotos').click( async () => {
    console.log("Estoy en el button");
    morePhotos();
});

$('#logout').click(()=>{
    $('#menu').show();
    $('#menu-2').hide();
    $('#logout').hide();
    localStorage.clear();
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

const getData = async (jwt, page) => {
    try {
        const response = await fetch(`http://localhost:3000/api/photos?page=${page}`,
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
    page++;
    try{
        const jwt = localStorage.getItem('jwt-token');
        console.log(jwt);
        const response = await fetch(`http://localhost:3000/api/photos?page=${page}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json()
        console.log(data);
        insertPhotos(data);

        return data
        
    }catch(err) {
        console.error(`Error: ${err}`);
    }
}
