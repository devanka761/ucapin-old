(function(){
    let lang = Bahasa[bahasa].pamerin;
    const container = document.querySelector(".container");

    const Pamer = (user) => {
        const element = document.createElement("div");
        element.classList.add("Pamer");
        element.innerHTML = (`
            <header class="header">
                <button data-button="kembali-pamer">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h3 class="judul">${lang.title} | Ucapin</h3>
                <button data-button="bikin-pamerin">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </header>
            <main class="main" data-content="list-kartu">
                LOADING . . .
            </main>
            <button class="bikin-btn" data-button="buat-pamerin"><i class="fa-solid fa-plus"></i> ${lang.create}</button>
        `);

        
        container.innerHTML = '';
        container.appendChild(element);
        
        element.querySelector(`[data-button="kembali-pamer"]`).onclick = () => window.location.href = `${window.location.origin}/meja/`;
        
        const wall = element.querySelector(`[data-content="list-kartu"]`);
        element.querySelector(`[data-button="bikin-pamerin"]`).onclick = () => openCardLists(wall, user);
        element.querySelector(`[data-button="buat-pamerin"]`).onclick = () => openCardLists(wall, user);
        getCard(wall, user);
    }

    let kartuTerpilih = null;
    const openCardLists = (wall, user) => {
        const element = document.createElement("div");
        element.classList.add("Komentar");
        element.innerHTML = (`
            <div class="komen-box">
                <div class="komen-atas">
                    <div data-kartu="author">
                        ${lang.create}
                    </div>
                    <button data-button="kembali"><i class="fa-solid fa-chevron-left"></i></button>
                </div>
                <div class="kolom-kartu" data-kartu="kolom-kartu">
                    LOADING . . .
                </div>
                <div class="komen-bawah">
                    <button class="kirim-kartu" data-button="kirim-kartu">Submit</button>
                </div>
            </div>
        `);

        const cardList = element.querySelector(`[data-kartu="kolom-kartu"]`);
        const cardSend = element.querySelector(`[data-button="kirim-kartu"]`);
        element.querySelector(`[data-button="kembali"]`).onclick = () => {
            kartuTerpilih = null;
            element.remove();
        }

        container.appendChild(element);
        getKirimData(cardList, cardSend, element, wall, user);
    }

    const getKirimData = (parent, kirim, grand, wall, user) => {
        parent.innerHTML = '';
        rdb.ref(`kartuGambar`).once("value", (cards) => {
            if(cards.exists()) {
                cards.forEach((data) => {
                    const snap = data.val();
                    const list = document.createElement("button");
                    list.classList.add("kartu");
                    list.innerHTML = (`<h3 class="judul">LOADING</h3>
                    <p class="deskripsi">Loading</p>`);

                    list.querySelector(".judul").innerText = snap.judul;
                    list.querySelector(".deskripsi").innerText = snap.ucapan.replace(/\n/g, ' ').replace(/\n+(?=\n\n)/g, ' ').replace(/\n+(?=\n)/g, ' ').substring(0, 15) + '...';
                    list.style.backgroundImage = `url(${snap.foto})`;

                    list.onclick = () => {
                        const listBefore = parent.querySelector('.activated');
                        if(listBefore) listBefore.classList.remove('activated');
                        list.classList.add('activated');
                        kartuTerpilih = data.key;
                        kirim.classList.add("active");
                    }

                    if(snap.owner === auth.currentUser.uid && snap.pamerin !== "publik") parent.appendChild(list);
                });
            }
        });

        rdb.ref(`kartuUser`).child(auth.currentUser.uid).once("value", (cards) => {
            if(!cards.exists()) {
                grand.querySelector(`[data-kartu="author"]`).innerHTML = lang.haveNoCard;
            }
        })

        getKirimSubmit(kirim, grand, wall, user);
    }

    const getKirimSubmit = (kirim, grand, wall, user) => {
        kirim.onclick = () => {
            if(kartuTerpilih != null) {
                kirim.classList.remove("active");
                rdb.ref(`kartuGambar`).child(kartuTerpilih).update({"pamerin": "publik"});
                kartuTerpilih = null;
                grand.remove();
                getCard(wall, user);
            }
        }
    }

    const getCard = (parent, user) => {
        parent.innerHTML = '';
        rdb.ref("kartuGambar").once("value" , (cards) => {
            if(cards.exists()) {
                cards.forEach((card) => {
                    let kartu = document.createElement("div");
                    kartu.classList.add("kartu");
                    kartu.innerHTML = (`
                        <div class="tentang">
                            <div class="metadata">
                                <h3 data-kartu="judul">Loading</h3>
                                <i data-kartu="kreator">Loading</i>
                            </div>
                            <div class="tombolan" data-kartu="tombol">
                                <button class="deskripsi" data-button="lihat">${lang.view} <i class="fa-solid fa-angles-right"></i></button>
                            </div>
                        </div>
                        <div class="status">
                            <button data-kartu="suka" class="suka">Loading</button>
                            <button data-kartu="komentar" class="komentar interaksi">Loading</button>
                        </div>
                    `);

                    const judul = kartu.querySelector(`[data-kartu="judul"]`);
                    const foto = kartu.querySelector(`.tentang .metadata`);

                    const kreator = kartu.querySelector(`[data-kartu="kreator"]`);
                    const tombol = kartu.querySelector(`[data-kartu="tombol"]`);
                    const suka = kartu.querySelector(`[data-kartu="suka"]`);
                    const komentar = kartu.querySelector(`[data-kartu="komentar"]`);

                    judul.innerText = card.val().judul;
                    foto.style.backgroundImage = `url(${card.val().foto})`;
                    
                    suka.onclick = () => sukai(user, card, suka, komentar);
                    kartu.querySelector(`[data-button="lihat"]`).onclick = () => window.open(`${window.location.origin}/kartu/?r=${card.key}`, "_blank");

                    getCardData(parent, user, card, kreator, tombol, komentar);
                    getCardStatus(user, card, suka, komentar);

                    if(card.val().pamerin === "publik") parent.prepend(kartu);
                })
            }
            const nomore = document.createElement("div");
            nomore.innerHTML = lang.nomore;
            parent.appendChild(nomore);
        })
    }

    const sukai = (user, card, suka, komentar) => {
        rdb.ref("kartuGambar/" + card.key + "/suka/" + user.uid).once("value", (data) => {
            if(data.exists()) {
                rdb.ref("kartuGambar/" + card.key + "/suka").child(user.uid).remove();
            } else {
                rdb.ref("kartuGambar/" + card.key + "/suka").child(user.uid).update({liked: true});
            }
            getCardStatus(user, card, suka, komentar);
        })
    }

    const getCardData = (wall, user, card, kreator, tombol, komentar) => {
        rdb.ref("users").child(card.val().owner).once("value", (data) => {
            let nickname = data.val().username || data.val().displayName;
            kreator.innerText = `Created by ${nickname}` || "Anonymous Card";
            komentar.onclick = () => openComments(user, nickname, komentar, card);
        });
        if(card.val().owner === user.uid) {
            const hapus = document.createElement("button");
            hapus.classList.add("hapus");
            hapus.innerHTML = (`${lang.remove} <i class="fa-solid fa-trash"></i>`);
            hapus.onclick = () => Notipin.Confirm({
                msg: lang.deletePost,
                type: "danger",
                onYes: () => {
                    rdb.ref("kartuGambar/" + card.key).update({pamerin: "private"});
                    getCard(wall, user)
                }
            })
            tombol.prepend(hapus);
        }
    }

    const getCardStatus = (user, card, suka, komentar) => {
        rdb.ref("kartuGambar/" + card.key + "/suka").once("value", (accounts) => {
            if(accounts.exists()) {

                rdb.ref("kartuGambar/" + card.key + "/suka/" + user.uid).once("value", (data) => {
                    if(data.exists()) {
                        suka.innerHTML = `<i class="fa-solid fa-heart"></i> ${accounts.numChildren()} ${lang.like}`;
                    } else {
                        suka.innerHTML = `<i class="fa-regular fa-heart"></i> ${accounts.numChildren()} ${lang.like}`;
                    }
                });

            } else {
                suka.innerHTML = `<i class="fa-regular fa-heart"></i> 0 ${lang.like}`;
            }
        });
        rdb.ref("kartuGambar/" + card.key + "/komentar").once("value", (accounts) => {
            if(accounts.exists()) {
                komentar.innerHTML = `<i class="fa-regular fa-comment"></i> ${accounts.numChildren()} ${lang.comment}`;
            } else {
                komentar.innerHTML = `<i class="fa-regular fa-comment"></i> 0 ${lang.comment}`;
            }
        });
    }

    const openComments = (user, nickname, komentar, card) => {
        const element = document.createElement("div");
        element.classList.add("Komentar");
        element.innerHTML = (`
            <div class="komen-box">
                <div class="komen-atas">
                    <div data-kartu="author">
                    </div>
                    <button data-button="kembali"><i class="fa-solid fa-chevron-left"></i></button>
                </div>
                <div class="komen-tengah" data-kartu="daftar-komentar">
                    LOADING . . .
                </div>
                <div class="komen-bawah">
                    <input data-input="komentar" type="text" maxlength="100" placeholder="${lang.typeHere}">
                    <button data-button="kirim-komentar"><i class="fa-solid fa-angles-right"></i></button>
                </div>
            </div>
        `);

        element.querySelector(`[data-kartu="author"]`).innerText = `${nickname}: ${card.val().judul}`;
        element.querySelector(`[data-button="kembali"]`).onclick = () => element.remove();

        const inputKomentar = element.querySelector(`[data-input="komentar"]`);
        const kirimKomentar = element.querySelector(`[data-button="kirim-komentar"]`);

        container.appendChild(element);

        inputKomentar.focus();

        const komenIn = element.querySelector(`[data-kartu="daftar-komentar"]`);
        getComments(komenIn, card.key);
        deteksiKirim(user, inputKomentar, kirimKomentar, card.key, komenIn);
    }

    const deteksiKirim = (user, input, kirim, key, komen) => {
        input.onkeydown = (e) => {
            if(e.keyCode == '13') {
                kirim.click();
            }
        }
        input.onkeyup = () => {
            input.value = input.value.replace(/^\s+/g, '').replace(/ +(?= )/g,'');
        }
        kirim.onclick = () => {
            if(input.value.length < 1) return;
            rdb.ref("kartuGambar/" + key + "/komentar").child(new Date().getTime()).set({
                nama: user.uid,
                pesan: input.value,
            });
            input.value = '';
            getComments(komen, key);
        }
    }

    const getComments = (komen, key) => {
        rdb.ref("kartuGambar/" + key + "/komentar").once("value", (comments) => {
            komen.innerHTML = '';
            if(comments.exists()) {
                comments.forEach((comment) => {
                    const element = document.createElement("div");
                    element.classList.add("untai");
                    element.innerHTML = (`
                        <div class="nick" data-untai="nickname" data-malehoy="${comment.key}"></div>
                        <div data-untai="pesan"></div>
                    `);
                    element.querySelector(`[data-untai="pesan"]`).innerText = comment.val().pesan;
                    getCommenterNickname(comment.val().nama, element.querySelector(`[data-untai="nickname"]`));

                    const hapusElement = document.createElement("i");
                    hapusElement.classList.add("fa-solid", "fa-trash", "hapus-element");

                    hapusElement.onclick = () => {
                        Notipin.Confirm({
                            msg: lang.deleteComment,
                            type: "danger",
                            onYes: () => {
                                rdb.ref("kartuGambar/" + key + "/komentar/" + comment.key).remove();
                                getComments(komen, key);
                            }
                        })
                    }

                    if(comment.val().nama === auth.currentUser.uid) element.appendChild(hapusElement);

                    komen.prepend(element);
                });
            }
        });
        const getCommenterNickname = (uid, untai) => {
            rdb.ref("users").child(uid).once("value", (data) => {
                let nickname = data.val().username || data.val().displayName;
                untai.innerText = nickname;
            });
        }
    }

    auth.onAuthStateChanged((user) => {
        if(user) {
            Pamer(user);
        } else {
            window.location.href = `${window.location.origin}/masuk/`;
        }
    })
}());
