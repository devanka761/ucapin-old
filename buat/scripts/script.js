(function() {
    let lang = Bahasa[bahasa].creation;
    const container = document.querySelector(".container");
    
    let last_edit = {
        last_judul: null,
        last_tanda: null,
        last_ucapan: null,
        last_warna: null,
        changeJudul: (data) => last_edit.last_judul = data,
        changeTanda: (data) => last_edit.last_tanda = data,
        changeUcapan: (data) => last_edit.last_ucapan = data,
        changeWarna: (data) => last_edit.last_warna = data
    }

    const Bikin = () => {
        const element = document.createElement("div");
        element.classList.add("Bikin");
        element.innerHTML = (`
        <header class="header">
            <button data-button="kembali-bikin">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <h3 class="judul">${lang.act} | Ucapin</h3>
        </header>
        <main class="main">
            <div class="form">
                
                <label for="judul">${lang.subject}</label>
                <input data-input="judul" type="text" name="judul" id="judul" placeholder="${lang.subjectPlaceholder}" maxlength="15"/>

                <label for="tanda">${lang.nick}</label>
                <input data-input="tanda" type="text" name="tanda" id="tanda" placeholder="${lang.nickPlaceholder}" maxlength="15"/>
                
                <label for="ucapan">${lang.msg}</label>
                <textarea data-input="ucapan" name="ucapan" id="ucapan" placeholder="${lang.msgPlaceholder}" maxlength="500"></textarea>

                <button data-button="pilih-gambar" class="pilih-gambar">
                    <i class="fa-solid fa-image"></i>
                </button>

                <button data-button="pilih-warna" class="pilih-warna">
                    <input data-input="pilih-warna" type="color" value="#ffc0cb"/>
                    <span>BG</span>
                </button>

            </div>
            <div class="tombolan">
                <button data-button="delete" class="merah">
                    <i class="fa-duotone fa-circle-x"></i> ${lang.clear}
                </button>
                <button data-button="save" class="kuning">
                    <i class="fa-duotone fa-pen-circle"></i> DRAFT
                </button>
                <button data-button="publish" class="hijau">
                    <i class="fa-duotone fa-circle-check"></i> SUBMIT
                </button>
            </div>
        </main>
        `);

        const kembali = element.querySelector("[data-button='kembali-bikin']");
        kembali.onclick = () => window.location.href = `${window.location.origin}/meja/`;

        const pilihGambar = element.querySelector(`[data-button="pilih-gambar"]`);
        pilihGambar.onclick = () => cariGambar(pilihGambar);

        const warna = element.querySelector(`[data-input="pilih-warna"]`);
        const judul = element.querySelector(`[data-input="judul"]`);
        const tanda = element.querySelector(`[data-input="tanda"]`);
        const ucapan = element.querySelector(`[data-input="ucapan"]`);
        const warnaRes = element.querySelector(`[data-button="pilih-warna"] span`);

        element.querySelector(`[data-button="pilih-warna"]`).onclick = () => {
            warna.click();
            warna.focus();
        }
        warna.onchange = () => {
            warna.value == "#ffc0cb" ? warnaRes.innerHTML = "PINK" : warnaRes.innerHTML = warna.value;
        }

        ucapan.onkeyup = () => {
            ucapan.value = ucapan.value.replace(/^\s+/g, '').replace(/ +(?= )/g,'').replace(/^\n+/g, '').replace(/\n /g, '\n').replace(/\n+(?=\n\n)/g, '');
        }

        const submit = element.querySelector(`[data-button="publish"]`);
        submit.onclick = () => publish(judul.value.replace(/^\s+/g, ''), tanda.value.replace(/^\s+/g, ''), ucapan.value, warna.value, element);
        const draft = element.querySelector(`[data-button="save"]`);
        draft.onclick = () => saveDraft.pushData(judul.value, tanda.value, ucapan.value, warna.value);
        const trash = element.querySelector(`[data-button="delete"]`);
        trash.onclick = () => saveDraft.menghapus(judul, tanda, ucapan, warna, warnaRes);

        const memoryData = saveDraft.mencari();
        if(memoryData) {
            saveDraft.memuat();
            saveDraft.terapkan(judul, tanda, ucapan, warna, warnaRes);
        }
        container.innerHTML = "";
        container.appendChild(element);
    }

    const saveDraft = {
        menyimpan: () => {
            window.localStorage.setItem("last_edit_data", JSON.stringify({
                last_edit: {
                    last_judul: last_edit.last_judul,
                    last_tanda: last_edit.last_tanda,
                    last_ucapan: last_edit.last_ucapan,
                    last_warna: last_edit.last_warna,
                }
            }));
        },
        mencari: () => {
            try {
                const lastData = window.localStorage.getItem("last_edit_data");
                return lastData ? JSON.parse(lastData) : null;
            } catch {
                return null;
            }
        },
        memuat: () => {
            const lastData = saveDraft.mencari();
            if(lastData) {
                Object.keys(lastData.last_edit).forEach((key) => {
                    last_edit[key] = lastData.last_edit[key];
                });
            }
        },
        menghapus: (judul, tanda, ucapan, warna, warnaRes) => {
            Notipin.Confirm({
                msg: lang.clearConfirm,
                type: "danger", 
                onYes: () => {
                    last_edit.changeJudul(null);
                    last_edit.changeTanda(null);
                    last_edit.changeUcapan(null);
                    last_edit.changeWarna("#ffc0cb");
                    saveDraft.menyimpan();
                    saveDraft.terapkan(judul, tanda, ucapan, warna, warnaRes);
                    Notipin.Alert({msg: lang.cleared, type: "blue"});
                },
                onNo: () =>  Notipin.Alert({msg: lang.canceled, type: "info"})
            })
        },
        terapkan: (judul, tanda, ucapan, warna, warnaRes) => {
            judul.value = last_edit.last_judul;
            tanda.value = last_edit.last_tanda;
            ucapan.value = last_edit.last_ucapan;
            warna.value = last_edit.last_warna;
            last_edit.last_warna == "#ffc0cb" ? warnaRes.innerHTML = "PINK" : warnaRes.innerHTML = last_edit.last_warna;
        },
        pushData: (judul, tanda, ucapan, warna) => {
            if(judul.length < 1 && tanda.length < 1 && ucapan.length < 1 && warna == "#ffc0cb") return Notipin.Alert({msg: lang.noChanges});

            last_edit.changeJudul(judul);
            last_edit.changeTanda(tanda);
            last_edit.changeUcapan(ucapan);
            last_edit.changeWarna(warna);
            saveDraft.menyimpan();
            Notipin.Alert({msg: lang.saved});
        }
    }

    const hasil = (kode) => {
        const fullURL = `${window.location.host}/kartu/?r=${kode}`;
        
        const hasilEl = document.createElement("div");
        hasilEl.classList.add("Hasil");
        hasilEl.innerHTML = (`
            <button class="close" data-button="close">
                <i class="fa-duotone fa-circle-chevron-left"></i>
                </button>
            <h1 class="judul">UCAPIN</h1>
            <h3 class="deskripsi">${lang.doneCreation}</h3>
            <div class="tombolan">
                <input data-input="link-value" type="text" value="${fullURL}" readonly="readonly"/>
                <button class="copy" data-button="copy-value"><i class="fa-light fa-copy"></i> ${lang.copy}</button>
            </div>
            <a href="../kartu/?r=${kode}" target="_blank"><span>${lang.livePreview}</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        `);

        const backBtn = hasilEl.querySelector(`[data-button="close"]`);
        backBtn.onclick = () => window.location.href = `${window.location.origin}/meja/`;

        const copyBtn = hasilEl.querySelector(`[data-button="copy-value"]`);
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(`${window.location.origin}/kartu/?r=${kode}`);
            Notipin.Alert({
                msg: lang.copied,
                type: "blue"
            });
        }

        last_edit.changeJudul(null);
        last_edit.changeTanda(null);
        last_edit.changeUcapan(null);
        last_edit.changeWarna("#ffc0cb");
        saveDraft.menyimpan();
        container.appendChild(hasilEl);
    }

    const cariGambar = (btnElement) => {
        const inpEl = document.createElement("input");
        inpEl.setAttribute("type", "file");
        inpEl.setAttribute("accept", "image/*");
        inpEl.click();

        inpEl.onchange = () => validasiGambar(btnElement, inpEl.value, inpEl);
    }
    
    let fileDOne = null;

    const validasiGambar = (btnElement, fileName, inpEl) => {

        const ext = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
        const valid = ["jpg", "jpeg", "png", "webp"];
        const file = inpEl.files[0];
        const ukuran = file.size / 1053818;
        const bulat = Math.ceil(ukuran * Math.pow(10, 2)) / Math.pow(10, 2);

        if(!valid.includes(ext.toLowerCase())) return Notipin.Alert({
            msg: lang.fileExtension,
        });

        if(file.size > 2102394) return Notipin.Alert({
            msg: lang.fileSize1+bulat+lang.fileSize2,
        });

        Notipin.Alert({
            msg: lang.fileSuccess+""+file.name,
            type: "info",
            onYes: () => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => btnElement.style.backgroundImage = `url(${reader.result})`;
            }
        });

        fileDOne = file;
    }

    const publish = (judul, tanda, ucapan, warna, bikinEl) => {

        if(judul.length < 2) return Notipin.Alert({
            msg: lang.failSubject
        });
        if(tanda.length < 2) return Notipin.Alert({
            msg: lang.failNick
        });
        if(ucapan.length < 10) return Notipin.Alert({
            msg: lang.failMsg
        });

        const file = fileDOne;
        try {
            console.log(file.name);
        } catch {
            return Notipin.Alert({msg: lang.failImg});
        }

        const uploading = document.createElement("div");
        uploading.classList.add("Uploader");
        uploading.innerHTML = `<h1>${lang.uploading}</h1>`;

        container.appendChild(uploading);

        const now = new Date().getTime().toString();
        const path = `kartuGambar/${auth.currentUser.uid}/${now}_${file.name}`;
        const cardRef = stg.ref(path);
        const cardUp = cardRef.put(file);
        const owner = auth.currentUser.uid;

        cardUp.on("state_changed", (snapshot) => {
            let progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            uploading.innerHTML = (`<h1>${lang.uploading}</h1><h2>${progress}%</h2>`);
        }, err  => {
            return Notipin.Alert({msg: err, type: "danger"})
        }, () => {
            cardUp.snapshot.ref.getDownloadURL().then(foto => {
                rdb.ref("kartuGambar").child(now).set({
                    judul, tanda, ucapan, warna, path, foto, owner
                });
                rdb.ref(`kartuUser/${auth.currentUser.uid}`).child(now).set({
                    exist: true
                });
                uploading.remove();
                bikinEl.remove();
                hasil(now);
            })
        })
    }

    auth.onAuthStateChanged((user) => {
        if(user) {
            Bikin(user);
        } else {
            window.location.href = `${window.location.origin}/masuk/`;
        }
    })

}());