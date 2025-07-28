console.log("lets start JavaScript")
let currentsongs = new Audio();
let songs;
let currFloder;


async function getsongs(folder) {
    currFloder = folder;
    const res = await fetch(`${folder}/info.json`);
    const data = await res.json();
    songs = data.songs;

    const songsul = document.querySelector(".songscard ul");
    songsul.innerHTML = "";

    for (const song of songs) {
        songsul.innerHTML += `
        <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replace(".mp3", "").replaceAll("_", " ")}</div>
                <div>Syed</div>
            </div>
            <span>Play Now</span>
            <img class="invert" src="playbutton.svg" alt="">
        </li>`;
    }

    // Add event listeners
    Array.from(songsul.getElementsByTagName("li")).forEach((e, i) => {
        e.addEventListener("click", () => {
            playMusic(songs[i]);
        });
    });

    return songs;
}



// Function to convert seconds to mm:ss format
function formatTime(decimalSeconds) {
    // Round to the nearest whole number
    const totalSeconds = Math.round(decimalSeconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format minutes and seconds to always have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}



// function to playmusic 

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsongs.src = `${currFloder}/${track}`

    if (!pause) {
        currentsongs.play()
        play.src = "paused.svg"
    }

    document.querySelector(".songsinfo").innerHTML = (track)
    document.querySelector(".songstime").innerHTML = ""




}
// functio  to display Albums
async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".Cardcontainer")
    Array.from(anchor).forEach(async e => {
        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0])
            //   Get meta data of folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            // cardContainer.innerHTML = cardContainer.innerHTML + `<div data-Folder="ncs" class="Card">
            //         <div class="play">
            //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
            //                 class="svg-icon">
            //                 <path
            //                     d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
            //                     stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            //             </svg>
            //         </div>
            //         <img src= "/songs/${folder}/cover.jpg" alt="">
            //         <h3>${response.title}</h3>
            //         <p>${response.description}</p>
            //     </div>
        }
    })


}



async function main() {


    await getsongs("songs/aj/")
    playMusic(songs[0], true)
    console.log(songs)


    // Display Albums card
    displayAlbum()

    //Add event listner to play,.next and previous
    play.addEventListener("click", () => {
        if (currentsongs.paused) {
            currentsongs.play()
            play.src = "paused.svg"

        }
        else {
            currentsongs.pause()
            play.src = "playbutton.svg"
        }
    })


    currentsongs.addEventListener("timeupdate", () => {
        // console.log(currentsongs.currentTime,currentsongs.duration);
        document.querySelector(".songstime").innerHTML = `${formatTime(currentsongs.currentTime)}: /${formatTime(currentsongs.duration)}`
        document.querySelector(".circle").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%";
    })

    document.querySelector(".screem").addEventListener("click", e => {
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentage + "%";
        currentsongs.currentTime = ((currentsongs.duration) * percentage) / 100

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".close").style.left = "236px"


    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"


    })



    // Adding Event listner to previous
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ([index - 1] > 0) {
            playMusic(songs[index - 1])
        }


    })
    // Adding Event listner to next
    farward.addEventListener("click", () => {

        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ([index + 1] < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    // Adding event Listner to VolumeFF
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsongs.volume = parseInt(e.target.value) / 100
    })


    //Load the playlist in card when clicked
    Array.from(document.getElementsByClassName("Card")).forEach(e => {
        e.addEventListener("click", async iteam => {

            await getsongs(`songs/${iteam.currentTarget.dataset.folder}`)
        })

    })

    // Add event listner to volume and replace to mute
    document.querySelector(".volumebtn img").addEventListener("click", e => {

        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }

        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsongs.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }
    })



}


main()
