const container = document.querySelector(".container");
(function() {
    const Landing = () => {
        const lang = Bahasa[bahasa].landing;
    
        const element = document.createElement("div");
        element.classList.add("Landing");
        element.innerHTML = (`
            <h1 class="judul">UCAPIN</h1>
            <select name="bahasa" data-option="bahasa">
                <option value="">Language</option>
                <option value="indonesia">Bahasa Indonesia</option>
                <option value="english">English</option>
            </select>
            <p class="deskripsi">${lang.desc}</p>
            <button class="google" data-button="login-google"><i class="fa-brands fa-google"></i> ${lang.google}</button>
        `);
        container.innerHTML = "";
        container.appendChild(element);
        
        const changelang = element.querySelector(`[data-option="bahasa"]`);
        changelang.onchange = () => {
            if(changelang.value == "indonesia" || changelang.value == "english") {
                getLang.ganti(changelang.value);
                Landing();
            }
        }

        const loginGoogle = element.querySelector("[data-button='login-google']");
        loginGoogle.onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
    
    auth.onAuthStateChanged((user) => {
        if(user) {
            window.location.href = `${window.location.origin}/meja/`;
        } else {
            Landing();
        }
    });
}());
