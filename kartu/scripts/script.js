(function() {
    const container = document.querySelector(".container");
    const urlParam = new URLSearchParams(window.location.search);
    let urlResult = urlParam.get("r") || "gagal";

    const getUrl = () => {
        if(urlResult == "gagal") {
            Notipin.Alert({
                msg: `KARTU TIDAK DAPAT DITEMUKAN!<br>PERIKSA KEMBALI URL YANG KAMU MASUKKAN`,
            });
            container.innerHTML = "KARTU TIDAK DAPAT DITEMUKAN!<br>PERIKSA KEMBALI URL YANG KAMU MASUKKAN";
            return;
        } else {
            getData(urlResult);
        }
    }

    const getData = (link) => {
        rdb.ref(`kartuGambar/${link}`).once("value", (data) => {
            
            try {
                const snap = data.val();
                getCardDetail(snap.judul, snap.tanda, snap.ucapan, snap.warna, snap.foto);
            } catch {
                Notipin.Alert({
                    msg: `KARTU TIDAK DAPAT DITEMUKAN!<br>PERIKSA KEMBALI URL YANG KAMU MASUKKAN`,
                    type: "danger",
                });
                container.innerHTML = "KARTU TIDAK DAPAT DITEMUKAN!<br>PERIKSA KEMBALI URL YANG KAMU MASUKKAN";
            }
        })
    }

    const getCardDetail = (judul, tanda, ucapan, warna, foto) => {
        const kesalahan = document.createElement("div");
        kesalahan.classList.add("kesalahan");
        kesalahan.innerHTML = "layar kamu terlalu kecil untuk menampilkan konten ini :(";

        const kartuEl = document.createElement("div");
        kartuEl.classList.add("kartu");
        kartuEl.innerHTML = (`
            <div class="sampul">
                <span>Buka >></span>
            </div>
            <div class="tulisan">
                <h3></h3>
                <p>Loading</p>
                <span>
                    Loading
                </span>
            </div>
        `);

        kartuEl.querySelector(".tulisan h3").innerText = judul;
        kartuEl.querySelector(".tulisan p").innerText = ucapan;
        kartuEl.querySelector(".tulisan span").innerText = tanda;
        kartuEl.querySelector(".sampul").style.backgroundImage = `url(${foto})`;
        document.body.style.background = warna;

        container.innerHTML = "";
        container.appendChild(kesalahan);
        container.appendChild(kartuEl);
    }

    getUrl();

}());
