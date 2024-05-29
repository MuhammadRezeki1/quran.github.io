const BASE_URL = "https://equran.id/api/v2";
const AUDIO_FULL_URLS = {
    "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/001.mp3",
    "02": "https://equran.nos.wjv-1.neo.id/audio-full/Abdul-Muhsin-Al-Qasim/001.mp3",
    "03": "https://equran.nos.wjv-1.neo.id/audio-full/Abdurrahman-as-Sudais/001.mp3",
    "04": "https://equran.nos.wjv-1.neo.id/audio-full/Ibrahim-Al-Dossari/001.mp3",
    "05": "https://equran.nos.wjv-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/001.mp3"
};

// Function to fetch the list of surahs
const fetchSurahs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/surat`); // Perbaikan di sini
        const data = await response.json();
        const surahList = document.getElementById('daftar-surat');
        data.data.forEach(surah => {
            const li = document.createElement('li');
            li.classList.add('mb-2', 'transition', 'transform', 'duration-300', 'ease-in-out', 'hover:scale-105');
            li.innerHTML = `<a href="#" class="text-blue-700 hover:text-blue-900" onclick="fetchSurah(${surah.nomor})">${surah.nomor}. ${surah.namaLatin} (${surah.nama})</a>`;
            surahList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching surahs:", error);
    }
};


// Function to fetch the content of a surah
const fetchSurah = async (surahNumber) => {
    try {
        const response = await fetch(`${BASE_URL}/surat/${surahNumber}`); // Perbaikan di sini
        const data = await response.json();
        const surahContent = document.getElementById('isi-surat');
        surahContent.innerHTML = `
            <h2 class="surah-title">${data.data.namaLatin}</h2>
            <div class="audio-container">
                <h3 class="audio-title">Audio</h3>
                <div class="audio-controls">
                    <audio id="audio-player" controls onplay="animateAudioBackground()" onpause="pauseAudioBackground()">
                        <source src="${AUDIO_FULL_URLS[surahNumber]}" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                </div>
                <select id="imam-selector" onchange="changeAudioSource(${surahNumber})" class="mt-4 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option value="Abdullah-Al-Juhany">Abdullah Al-Juhany</option>
                    <option value="Abdul-Muhsin-Al-Qasim">Abdul Muhsin Al-Qasim</option>
                    <option value="Abdurrahman-as-Sudais">Abdurrahman as-Sudais</option>
                    <option value="Ibrahim-Al-Dossari">Ibrahim Al-Dossari</option>
                    <option value="Misyari-Rasyid-Al-Afasi">Misyari Rasyid Al-Afasi</option>
                </select>
            </div>
            ${data.data.ayat.map((ayat, index) => `
                <div class="ayat">
                    <div class="ayat-arabic">${index + 1}. ${ayat.teksArab}</div>
                    <div class="ayat-translation">${ayat.teksIndonesia ? ayat.teksIndonesia : "Tidak tersedia"}</div>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error("Error fetching surah:", error);
    }
};


// Function to change the audio source based on the selected imam
const changeAudioSource = (surahNumber) => {
    const imamSelector = document.getElementById('imam-selector');
    const selectedImam = imamSelector.value;
    const audioPlayer = document.getElementById('audio-player');
    const newSource = `https://equran.nos.wjv-1.neo.id/audio-full/${selectedImam}/${surahNumber.toString().padStart(3, '0')}.mp3`;
    audioPlayer.src = newSource;
    audioPlayer.load(); // Memuat ulang audio dengan sumber baru
};


// Function to animate audio background
const animateAudioBackground = () => {
    const audioContainer = document.querySelector('.audio-container');
    audioContainer.style.animation = 'gradientAnimation 15s ease infinite';
};

// Function to pause audio background animation
const pauseAudioBackground = () => {
    const audioContainer = document.querySelector('.audio-container');
    audioContainer.style.animation = 'none';
};

// Fetch and display the list of surahs when the page loads
document.addEventListener('DOMContentLoaded', fetchSurahs);