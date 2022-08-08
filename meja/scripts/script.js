(function() {
    const container = document.querySelector(".container");
    
    const Dashboard = (user, dpname, photo) => {
        let lang = Bahasa[bahasa].dashboard;
        const element = document.createElement("div");
        element.classList.add("Dashboard");
        element.innerHTML = (`
            <header class="header">
                <h1 class="judul">UCAPIN</h1>
                <select name="bahasa" data-option="bahasa">
                    <option value="">Lang</option>
                    <option value="indonesia">ID</option>
                    <option value="english">EN</option>
                </select>
                <button class="setting" data-button="setting">
                <img width="20" height="20" src="../images/default.jpg" alt="profil">
                <span class="username">loading</span>
                    <i class="fa-light fa-gear"></i>
                </button>
            </header>
            <main class="main">
                <div class="jumlah-kartu">
                    <span><b>- Loading -</b></span>
                    </div>
                    <div class="list-kartu"></div>
                <div class="tombolan">
                    <button data-button="bagikan-kartu"><i class="fa-solid fa-rectangle-vertical-history"></i> ${lang.post}</button>
                    <button data-button="buat-kartu"><i class="fa-solid fa-book-sparkles"></i> ${lang.createNew}</button>
                </div>
            </main>
        `);
        container.innerHTML = "";
        
        const changelang = element.querySelector(`[data-option="bahasa"]`);
        changelang.onchange = () => {
            if(changelang.value == "indonesia" || changelang.value == "english") {
                getLang.ganti(changelang.value);
                Dashboard(user, dpname, photo);
            }
        }

        element.querySelector(`[data-button="bagikan-kartu"]`).onclick = () => window.location.href = `${window.location.origin}/pamer/`

        const username = element.querySelector(".header .setting .username");
        username.innerText = dpname.substring(0, 7) + '...';
        const userimage = element.querySelector(".header .setting img");
        userimage.src = photo;
        const settingBtn = element.querySelector(".header [data-button='setting']");
        settingBtn.onclick = () => {
            const cardBefore = container.querySelector(".Hasil");
            if(cardBefore) cardBefore.remove();

            const cardEl = document.createElement("div");
            cardEl.classList.add("Hasil");
            cardEl.innerHTML = (`
                <button class="close" data-button="close">
                    <i class="fa-duotone fa-circle-x"></i>
                </button>
                <h1 class="judul">${lang.account}</h1>
                <h3 class="deskripsi">${lang.uname}</h3>
                    <input data-input="nama-baru" type="text" maxlength="15"/>
                <div class="tombolan">
                    <button class="copy" data-button="submit-nama"><i class="fa-solid fa-check"></i> Submit</button>
                    <button class="delete" data-button="logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>
            `);
            const changename = cardEl.querySelector(`[data-button="submit-nama"]`);
            const username = cardEl.querySelector(`[data-input="nama-baru"]`);

            container.appendChild(cardEl);
            username.focus();
            
            username.setAttribute("placeholder", dpname);

            username.onkeyup = () => {
                username.value = username.value.replace(/^\s+/g, '').replace(/ +(?=)/g,'');
            }

            username.onkeydown = (e) => {
                if(e.keyCode == '13') changename.click();
            }

            changename.onclick = () => {
                if(username.value.length < 1) return cardEl.remove();
                if(username.value.length < 4) return Notipin.Alert({msg: lang.changeuname});
                rdb.ref('users').child(user.uid).update({username: username.value});
                Dashboard(user, username.value, photo);
            }
            cardEl.querySelector(`[data-button="logout"]`).onclick = () => Notipin.Confirm({
                msg: lang.logout,
                type: "danger",
                onYes: () => auth.signOut().then(() => window.location.href = window.location.origin)
            });
            cardEl.querySelector(`[data-button="close"]`).onclick = () => cardEl.remove();
        }

        const buat = element.querySelector(`.main .tombolan [data-button="buat-kartu"]`);
        buat.onclick = () => window.location.href = `${window.location.origin}/buat/`;

        container.appendChild(element);
        const cardLists = element.querySelector(".main .list-kartu");
        const cardCount = element.querySelector(".main .jumlah-kartu span");
        getData(cardLists, cardCount, user, dpname, photo);
    }

    const getData = (parent, jumlah, user, dpname, photo) => {
        let lang = Bahasa[bahasa].dashboard;
        rdb.ref(`kartuGambar`).once("value", (cards) => {
            if(cards.exists()) {
                cards.forEach((data) => {
                    const snap = data.val();
                    const list = document.createElement("button");
                    list.classList.add("kartu");
                    list.innerHTML = (`<h3 class="judul">LOADING</h3>
                    <p class="deskripsi">Loading</p>`);

                    list.querySelector(".judul").innerText = snap.judul;
                    list.querySelector(".deskripsi").innerText = snap.ucapan.replace(/\n/g, ' ').replace(/\n+(?=\n\n)/g, ' ').replace(/\n+(?=\n)/g, ' ').substring(0, 30) + '...';
                    list.style.backgroundImage = `url(${snap.foto})`;
                    
                    list.onclick = () => getCardDetail(data.key, snap.judul, snap.tanda, snap.ucapan, snap.foto, snap.path, user, dpname, photo);

                    if(snap.owner === auth.currentUser.uid) parent.appendChild(list);
                });
            }
        })
        rdb.ref(`kartuUser`).child(auth.currentUser.uid).once("value", (cards) => {
            if(cards.exists()) {
                jumlah.innerHTML = `${lang.ifHave} <b>${cards.numChildren()} ${lang.ifHaveEnd}</b>`;
            } else {
                jumlah.innerText = lang.haveNoCard;
                parent.innerHTML = `<button class="kartu"><p class="deskripsi">${lang.createOne}</p><h3><i class="fa-solid fa-angles-right"></i></h3></button>`;
                parent.querySelector("button.kartu").onclick = () => window.location.href = `${window.location.origin}/buat/`;
            }
        })
    }
    
    const getCardDetail = (key, judul, tanda, ucapan, foto, path, user, dpname, photo) => {
        let lang = Bahasa[bahasa].dashboard;
        const cardBefore = container.querySelector(".Hasil");
        if(cardBefore) cardBefore.remove();

        const cardEl = document.createElement("div");
        cardEl.classList.add("Hasil");
        cardEl.innerHTML = (`
            <button class="close" data-button="close">
                <i class="fa-duotone fa-circle-x"></i>
            </button>
            <h1 class="judul"></h1>
            <h3 class="deskripsi"></h3>
            <input data-input="link-value" type="text" value="${window.location.host}/kartu/?r=${key}" readonly="readonly"/>
            <div class="tombolan">
                <button class="copy" data-button="copy-value"><i class="fa-light fa-copy"></i> ${lang.copy}</button>
                <button class="delete" data-button="delete-card"><i class="fa-light fa-trash"></i> ${lang.delete}</button>
            </div>
        `);

        cardEl.querySelector(".judul").innerText = judul.substring(0, 10) + '...';
        cardEl.querySelector(".deskripsi").innerText = ucapan.replace(/\n/g, ' ').replace(/\n+(?=\n\n)/g, ' ').replace(/\n+(?=\n)/g, ' ').substring(0, 24) + '...';

        const hapus = cardEl.querySelector(`[data-button="delete-card"]`);
        hapus.onclick = () => Notipin.Confirm({
            msg: `${lang.deleteConfirm} "${judul.toString()}"`,
            type: "danger",
            onYes: () => {
                stg.ref(path).delete().then(() => {
                    rdb.ref(`kartuGambar/${key}`).remove();
                    rdb.ref(`kartuUser/${auth.currentUser.uid}/${key}`).remove();
                    cardEl.remove();
                    Dashboard(user, dpname, photo);
                    Notipin.Alert({
                        msg: lang.cardDeleted,
                    });
                }).catch((err) => {
                    console.log(err)
                })
            }
        })

        const salin = cardEl.querySelector(`[data-button="copy-value"]`);
        salin.onclick = () => {
            navigator.clipboard.writeText(`${window.location.origin}/kartu/?r=${key}`);
            Notipin.Alert({
                msg: lang.copied,
                type: "blue"
            });
        }

        cardEl.querySelector(`[data-button="close"]`).onclick = () => cardEl.remove();

        container.appendChild(cardEl);
    }

    auth.onAuthStateChanged((user) => {
        if(user) {
            rdb.ref("users").child(user.uid).update({displayName: user.displayName || `User${new Date().getTime()}`});
            rdb.ref("users").child(user.uid).once("value", (data) => {
                let nickname = data.val().username || data.val().displayName || `User${new Date().getTime()}`;
                Dashboard(user, nickname, user.photoURL || "../images/default.jpg");
            })
        } else {
            window.location.href = `${window.location.origin}/masuk/`;
        }
    });
}());
