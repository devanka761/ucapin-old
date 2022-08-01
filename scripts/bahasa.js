const Bahasa = {
    indonesia: {
        code: "id",
        landing: {
            desc: "Buat Kartu Ucapan dan Tunjukkan Pada Orang Terkasih Kamu!",
            google: "masuk dengan google",
            github: "masuk dengan github",
            email: "masuk dengan email",
            emailPlaceholder: "Tulis Email Kamu . . .",
            cancel: "Batal",
            tryAgain: "Coba Lagi",
            emailConfirm: "Masukkan Kembali Email Kamu",
            check: "Sedang Memeriksa . . .",
            successLine1: "Silakan periksa email untuk Redirect Sign-In URL.",
            successLine2: "Terkadang akan masuk ke 'Spam'",
        },
        dashboard: {
            haveNoCard: "Kamu Belum Memiliki Kartu",
            ifHave: "Kamu Memiliki",
            ifHaveEnd: "Kartu",
            createOne: "Buat Kartu Sekarang!",
            support: "Dukung Kami",
            post: "Kiriman",
            createNew: "Buat Kartu Baru",
            logout: "Yakin ingin keluar dari akun kamu?",
            copy: "Salin",
            delete: "Hapus",
            deleteConfirm: "Yakin ingin menghapus ",
            cardDeleted: "Berhasil Dihapus!",
            copied: "Berhasil Disalin!",
            account: "Akun",
            uname: "Nama Pengguna Baru",
            changeuname: "Nama Pengguna Minimal 4 Karakter",
        },
        creation: {
            act: "Bikin Kartu",
            subject: "Judul",
            subjectPlaceholder: "Maks 15 Karakter",
            nick: "Tanda Tangan",
            nickPlaceholder: "Nama Panggilan",
            msg: "Ucapan/Pesan",
            msgPlaceholder: "Maks 500 Karakter",
            clear: "BUANG",
            clearConfirm: "Yakin ingin membersihkan<br>tulisan kamu di halaman ini?",
            cleared: "Berhasil dibersihkan..",
            canceled: "Dibatalkan",
            noChanges: "Kamu Belum Menulis Apapun :v",
            saved: "Tulisan kamu berhasil disimpan ke draft dan<br>akan otomatis dimuat pada halaman ini",
            doneCreation: "Berhasil Membuat Kartu!",
            livePreview: "Lihat",
            copy: "Salin",
            copied: "Berhasil Disalin!",
            fileExtension: "FILE YANG DITERIMA HANYALAH DENGAN TIPE 'JPG, JPEG, PNG, WEBP'",
            fileSize1: "Ukuran file kamu adalah ",
            fileSize2: "MB<br/>Maksimal upload adalah 2 MB",
            fileSuccess: "Sukses Menambahkan ",
            failSubject: "Judul Minimal 2 Karakter",
            failNick: "Tanda Tangan Minimal 2 Karakter",
            failMsg: "Ucapan/Pesan Minimal 10 Karakter",
            failImg: "Harap Isi Gambar Terlebih Dahulu",
            uploading: "Uploading",
        },
        pamerin: {
            title: "Kiriman",
            nomore: "Tidak Ada Kiriman Lainnya",
            create: "Buat Kiriman",
            like: "Suka",
            comment: "Komentar",
            remove: "Tarik",
            view: "Lihat",
            typeHere: "Tulis Sesuatu",
            deleteComment: "Yakin Ingin Menghapus Komentar Ini?",
            deletePost: "Yakin Ingin Menarik Kartu Ini Dari Kiriman?",
            haveNoCard: "Kamu Belum Memiliki Kartu",
        }
    },
    english: {
        code: "english",
        landing: {
            desc: "Make Greeting Cards and Show It To Your Loved Ones!",
            google: "google login",
            github: "github login",
            email: "email login",
            emailPlaceholder: "Your Email . . .",
            cancel: "Cancel",
            tryAgain: "Try Again",
            emailConfirm: "Please provide your email for confirmation",
            check: "Checking . . .",
            successLine1: "Please Check Your Email for Redirect Sign-In URL.",
            successLine2: "Sometime it will be on 'Spam'",
        },
        dashboard: {
            haveNoCard: "You don't have any card",
            ifHave: "You Have",
            ifHaveEnd: "Card(s)",
            createOne: "Create Your First Card!",
            support: "Support Us",
            post: "Posts",
            createNew: "Create New",
            logout: "Are you trying to logout now?",
            copy: "Copy",
            delete: "Delete",
            deleteConfirm: "Do you want to delete ",
            cardDeleted: "Card Has Been Deleted!",
            copied: "Copied!",
            account: "Account",
            uname: "New Username",
            changeuname: "Username At Least 4 Characters",
        },
        creation: {
            act: "Creation",
            subject: "Subject",
            subjectPlaceholder: "Max: 15 Characters",
            nick: "Signature",
            nickPlaceholder: "Short Name",
            msg: "Message",
            msgPlaceholder: "Max: 500 Characters",
            clear: "CLEAR",
            clearConfirm: "Do you want to clear<br>all these fields?",
            cleared: "Cleared..",
            canceled: "Canceled",
            noChanges: "Nothing Changes",
            saved: "Your fields data have been saved to draft<br> and will automatically loaded next time",
            doneCreation: "Card Successfully Created!",
            livePreview: "View",
            copy: "Copy",
            copied: "Copied!",
            fileExtension: "PLEASE GRAB FILE THAT MATCHES WITH ONE OF THIS TYPE 'JPG, JPEG, PNG, WEBP'",
            fileSize1: "The file size is ",
            fileSize2: "MB<br/>Please upload less than or equals to 2 MB",
            fileSuccess: "Added ",
            failSubject: "Subject at least 2 characters",
            failNick: "Signature at least 2 characters",
            failMsg: "Message at least 10 characters",
            failImg: "Please grab a picture first",
            uploading: "Uploading",
        },
        pamerin: {
            title: "Posts",
            nomore: "No More Cards Found",
            create: "Create Post",
            like: "Like(s)",
            comment: "Comment(s)",
            remove: "Rem",
            view: "View",
            typeHere: "Say Something",
            deleteComment: "Do you want to delete this comment?",
            deletePost: "Do you want to remove this card from posts list?",
            haveNoCard: "You don't have any card",
        }
    }
}

let bahasa = "indonesia";

const getLang = {
    simpan() {
        window.localStorage.setItem("last_language", bahasa);
    },
    cari() {
        try {
            const data = window.localStorage.getItem("last_language");
            return data ? data : null;
        } catch {
            return null;
        }
    },
    muat() {
        const data = this.cari();
        bahasa = data;
    },
    ganti(newData) {
        bahasa = newData;
        this.simpan();
        this.muat();
    }
}
const getLangData = getLang.cari();
if(getLangData) getLang.muat();
