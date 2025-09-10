    import './style.css'

// For use later to place HTML in TODO
// for now, in index.html for easier access
// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const clientId = "31a7f09f16434b049b4e6cc8313570c4";
const code = undefined;

if (!code){
    redirectToAuthCodeFlow(clientId);
}else{
    const accessToken = await getAccessToken(clientId,code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
}

// start of functions

async function redirectToAuthCodeFlow(clientId:string){
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier",verifier);

    const params = new URLSearchParams();
    params.append("client_id",clientId)
    params.append("response_type","code");
    params.append("redirect_uri","http://127.0.0.1:5173/callback");
    params.append("scope","user-read-private user-read-email");
    params.append("code_challenge_method","S256");
    params.append("code_challenge",challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
} //end of function

function generateCodeVerifier(length: number){
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length;i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}//end of function

async function generateCodeChallenge(codeVerifier:string){
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256',data);
    return btoa(String.fromCharCode.apply(null,[...new Uint8Array(digest)]))
        .replace(/\+/g,'-')
        .replace(/\//g,'_')
        .replace(/=+$/, '');
} //end of function

export async function getAccessToken(clientId:string,code:string){
    const verifier = localStorage.getItem("verifier");
    const params = new URLSearchParams();
    params.append("client_id",clientId);
    params.append("grant_type","authorization_code");
    params.append("code",code);
    params.append("redirect_uri","http://127.0.0.1:5173/callback");
    params.append("code_verifier",verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token",{
        method:"POST",
        headers: {"Content-Type:":"application/x-www-form-urlencoded"},
        body:params
    });
    const { accessToken } = await result.json();
    return accessToken;

} //end of function

async function fetchProfile(token:string): Promise<any> {
    const result  = await fetch("https://api.spotify.com/v1/me",{
        method: "GET", headers: {Authorization: `Bearer ${token}` }
    });
    return await result.json();
}//end of function

function populateUI(profile:UserProfile){
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
} //end of function